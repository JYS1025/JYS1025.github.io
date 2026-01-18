const fs = require('fs');
const path = require('path');

const postsDirectory = path.join(process.cwd(), 'posts');

console.log("--- Debugging Slugs ---");

if (fs.existsSync(postsDirectory)) {
    const fileNames = fs.readdirSync(postsDirectory);

    fileNames.filter(f => f.endsWith('.md')).forEach(fileName => {
        const slugRaw = fileName.replace(/\.md$/, '');
        const slugNFC = slugRaw.normalize('NFC');
        const slugNFD = slugRaw.normalize('NFD');

        console.log(`\nFile: "${fileName}"`);
        console.log(`  Hex (Raw): ${Buffer.from(fileName).toString('hex')}`);
        console.log(`  Slug (Raw): "${slugRaw}"`);
        console.log(`  Slug (NFC): "${slugNFC}"`);
        console.log(`  Slug (NFD): "${slugNFD}"`);
        console.log(`  Equal to NFC? ${slugRaw === slugNFC}`);
        console.log(`  Equal to NFD? ${slugRaw === slugNFD}`);
    });
} else {
    console.log("Posts directory not found.");
}
