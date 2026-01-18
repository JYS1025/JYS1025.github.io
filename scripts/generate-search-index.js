const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'posts');
const OUTPUT_FILE = path.join(process.cwd(), 'public', 'search.json');
const GITHUB_USERNAME = "JYS1025";

async function generateSearchIndex() {
    console.log('Generating search index...');

    const searchData = [];

    // 1. Process Blog Posts
    if (fs.existsSync(POSTS_DIR)) {
        const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md') || file.endsWith('.Md'));

        files.forEach(file => {
            const filePath = path.join(POSTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);

            // Generate slug from filename (removing extension)
            // Note: This must match the slug generation logic in lib/posts.ts
            // In lib/posts.ts, it seems we use the filename as the slug (decoded).
            // Let's check if we need to normalize. 
            // The current system seems to use the filename directly as the slug.
            const slug = file.replace(/\.md$/i, '');

            searchData.push({
                type: 'Post',
                title: data.title || slug,
                description: data.description || '',
                tags: data.topics || [],
                url: `/blog/${slug}`,
                date: data.date
            });
        });
        console.log(`Processed ${files.length} blog posts.`);
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
