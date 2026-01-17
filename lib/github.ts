export interface Project {
    title: string
    description: string
    tags: string[]
    github: string
    demo?: string
}

// TODO: Replace with your actual GitHub username
const GITHUB_USERNAME = "JYS1025"

export async function getGithubRepos(): Promise<Project[]> {
    /*
    if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
        console.warn("Please set your GitHub username in lib/github.ts")
        return []
    }
    */

    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`, {
            next: { revalidate: 3600 }, // Revalidate every hour
        })

        if (!response.ok) {
            throw new Error("Failed to fetch repositories")
        }

        const repos = await response.json()

        return repos
            .filter((repo: any) => !repo.fork) // Filter out forks if desired
            .map((repo: any) => ({
                title: repo.name,
                description: repo.description || "No description available.",
                tags: repo.topics && repo.topics.length > 0 ? repo.topics : [repo.language].filter(Boolean),
                github: repo.html_url,
                demo: repo.homepage || undefined,
            }))
    } catch (error) {
        console.error("Error fetching GitHub repos:", error)
        return []
    }
}
