const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'posts');

console.log("--- Debugging Ernst Kapp ---");

if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory);

    const target = fileNames.find(f => f.toLowerCase().includes('ernst'));

    if (target) {
        console.log(`Found file: "${target}"`);
        console.log(`Hex: ${Buffer.from(target).toString('hex')}`);

        const slugRaw = target.replace(/\.md$/i, '');
        const slugNFC = slugRaw.normalize('NFC');

        console.log(`Slug (Raw): "${slugRaw}"`);
        console.log(`Slug (NFC): "${slugNFC}"`);
        console.log(`Slug Hex: ${Buffer.from(slugNFC).toString('hex')}`);

        // Simulate getPosts logic
        const isMd = target.toLowerCase().endsWith('.md');
        console.log(`Ends with .md (case-insensitive)? ${isMd}`);
    } else {
        console.log("File not found.");
    }
}
