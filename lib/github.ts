export interface Project {
    title: string
    description: string
    tags: string[]
    github: string
    category: string
    demo?: string
}

// TODO: Replace with your actual GitHub username
const GITHUB_USERNAME = "JYS1025"

/**
 * Category rules — kept at the top so the matching table is easy to
 * maintain without touching the fetch/mapping logic below.
 *
 * Order matters: the first rule whose `match` returns true wins.
 * `match` receives the lowercased repo name and description.
 */
interface CategoryRule {
    category: string
    match: (name: string, desc: string) => boolean
}

const CATEGORY_RULES: CategoryRule[] = [
    {
        category: "Tools & Web",
        match: (name, desc) =>
            /pomodoro|trader|blog|github\.io|pic-to-poem|bias-analyzer/.test(name) ||
            /web-based|web application|website/.test(desc),
    },
    {
        category: "AI & ML",
        match: (name, desc) =>
            /spiking|svg-agentic|neural|gestaltzerfall|broadcasting/.test(name) ||
            /llm|diffusion|\bai\b|neural/.test(desc),
    },
]

const DEFAULT_CATEGORY = "Others"

// Per-repo overrides for homepage/demo links that can't be inferred from
// the GitHub API response. Add entries here as needed.
const DEMO_OVERRIDES: Record<string, string> = {
    "news-bias-analyzer":
        "https://news-bias-analyzer-p5xpvp7wqjkjxc2cnv8qg2.streamlit.app",
}

function categorize(name: string, desc: string): string {
    for (const rule of CATEGORY_RULES) {
        if (rule.match(name, desc)) return rule.category
    }
    return DEFAULT_CATEGORY
}

export async function getGithubRepos(): Promise<Project[]> {
    try {
        const response = await fetch(
            `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
            { next: { revalidate: 60 } }
        )

        if (!response.ok) {
            throw new Error("Failed to fetch repositories")
        }

        const repos = await response.json()

        return repos.map((repo: any) => {
            const nameLower = repo.name.toLowerCase()
            const descLower = (repo.description || "").toLowerCase()

            return {
                title: repo.name,
                description: repo.description || "No description available.",
                tags:
                    repo.topics && repo.topics.length > 0
                        ? repo.topics
                        : [repo.language].filter(Boolean),
                github: repo.html_url,
                category: categorize(nameLower, descLower),
                demo: DEMO_OVERRIDES[repo.name] || repo.homepage || undefined,
            }
        })
    } catch (error) {
        console.error("Error fetching GitHub repos:", error)
        return []
    }
}
