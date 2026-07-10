const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'posts');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'search.json');
const GITHUB_USERNAME = "JYS1025";

/**
 * Returns true if a file is ignored by .gitignore (i.e. a confidential post
 * that should never reach the public search index). Falls back to false
 * (treat as public) when git is unavailable so local builds still succeed.
 */
function isGitIgnored(filePath) {
    try {
        execSync(`git check-ignore -q ${JSON.stringify(filePath)}`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

async function generateSearchIndex() {
    console.log('Generating search index...');

    const searchData = [];

    // 1. Process Blog Posts
    if (fs.existsSync(POSTS_DIR)) {
        const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md') || file.endsWith('.Md'));

        let included = 0;
        let skipped = 0;
        files.forEach(file => {
            const filePath = path.join(POSTS_DIR, file);

            // Skip posts that .gitignore marks as hidden/confidential so
            // they never leak into the public search index.
            if (isGitIgnored(filePath)) {
                skipped++;
                return;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);

            const slug = file.replace(/\.md$/i, '');

            searchData.push({
                type: 'Post',
                title: data.title || slug,
                description: data.description || '',
                tags: data.topics || [],
                url: `/blog/${slug}`,
                date: data.date
            });
            included++;
        });
        console.log(`Processed ${included} blog posts (${skipped} hidden by .gitignore).`);
    }

    // 2. Fetch GitHub Projects
    try {
        console.log('Fetching GitHub projects...');
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);

        if (response.ok) {
            const repos = await response.json();
            const projects = repos
                .filter(repo => !repo.fork)
                .map(repo => ({
                    type: 'Project',
                    title: repo.name,
                    description: repo.description || '',
                    tags: repo.topics || [repo.language].filter(Boolean),
                    url: repo.html_url, // External link
                    demo: repo.name === "news-bias-analyzer"
                        ? "https://news-bias-analyzer-p5xpvp7wqjkjxc2cnv8qg2.streamlit.app"
                        : (repo.homepage || undefined),
                    date: repo.updated_at
                }));

            searchData.push(...projects);
            console.log(`Processed ${projects.length} projects.`);
        } else {
            console.error('Failed to fetch GitHub projects:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
    }

    // 3. Publications (Placeholder)
    // searchData.push({ type: 'Publication', ... });

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(searchData, null, 2));
    console.log(`Search index generated at ${OUTPUT_FILE}`);
}

generateSearchIndex();
