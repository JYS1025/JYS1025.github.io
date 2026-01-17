const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const filePath = path.join(process.cwd(), 'posts', 'neural-latent-space.md');
const fileContents = fs.readFileSync(filePath, 'utf8');
const matterResult = matter(fileContents);
const topics = matterResult.data.topics || [];

console.log('Topics found:', topics);

topics.forEach(topic => {
    const slug = topic.toLowerCase().replace(/\s+/g, '-');
    console.log(`Topic: "${topic}"`);
    console.log(`Slug:  "${slug}"`);
    console.log('Char codes:', topic.split('').map(c => c.charCodeAt(0)));
});
