const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const matter = require('gray-matter');

const POSTS_DIR = path.join(process.cwd(), 'posts');
const OUTPUT_RSS = path.join(process.cwd(), 'public', 'rss.xml');
const OUTPUT_FEED = path.join(process.cwd(), 'public', 'feed.xml');
const SITE_URL = 'https://jys1025.github.io';

function isGitIgnored(filePath) {
    try {
        execSync(`git check-ignore -q ${JSON.stringify(filePath)}`, { stdio: 'ignore' });
        return true;
    } catch {
        return false;
    }
}

function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&apos;';
            case '"': return '&quot;';
        }
    });
}

function generateRss() {
    console.log('Generating RSS feed...');

    if (!fs.existsSync(POSTS_DIR)) {
        console.log('No posts directory found.');
        return;
    }

    const files = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md') || file.endsWith('.Md'));
    const posts = [];

    files.forEach(file => {
        const filePath = path.join(POSTS_DIR, file);
        if (isGitIgnored(filePath)) return;

        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: body } = matter(content);
        const slug = file.replace(/\.md$/i, '');

        let title = data.title;
        if (!title) {
            const titleMatch = body.match(/^#\s+(.+)$/m);
            title = titleMatch ? titleMatch[1] : slug;
        }

        const date = data.date || new Date().toISOString().split('T')[0];
        const description = data.description || body.slice(0, 200).replace(/[#*`_]/g, '') + '...';
        const topics = data.topics || [];

        posts.push({
            slug,
            title,
            date,
            description,
            topics,
        });
    });

    // Sort newest first
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const buildDate = new Date().toUTCString();

    const itemsXml = posts.map(post => {
        const postUrl = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
        const pubDate = new Date(post.date).toUTCString();
        const categoriesXml = post.topics.map(t => `<category>${escapeXml(t)}</category>`).join('');

        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
      ${categoriesXml}
    </item>`;
    }).join('\n');

    const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>JYS Blog</title>
    <link>${SITE_URL}</link>
    <description>A personal portfolio and research blog exploring Generative AI, Neuroscience, and Philosophy.</description>
    <language>ko</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

    fs.writeFileSync(OUTPUT_RSS, rssXml);
    fs.writeFileSync(OUTPUT_FEED, rssXml);
    console.log(`RSS feed generated at ${OUTPUT_RSS} and ${OUTPUT_FEED} (${posts.length} posts).`);
}

generateRss();
