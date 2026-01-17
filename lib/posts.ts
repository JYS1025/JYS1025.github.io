import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

export interface BlogPost {
    slug: string
    title: string
    date: string
    description: string
    topics: string[]
    content: string
}

export interface Topic {
    name: string
    slug: string
    count: number
}

export function getPosts(): BlogPost[] {
    // Get file names under /posts
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
        .filter((fileName) => fileName.endsWith('.md'))
        .map((fileName) => {
            // Remove ".md" from file name to get slug
            const slug = fileName.replace(/\.md$/, '')

            // Read markdown file as string
            const fullPath = path.join(postsDirectory, fileName)
            const fileContents = fs.readFileSync(fullPath, 'utf8')

            // Use gray-matter to parse the post metadata section
            const matterResult = matter(fileContents)

            // Extract title from the first line if not in frontmatter
            let title = matterResult.data.title
            let content = matterResult.content

            if (!title) {
                const titleMatch = content.match(/^#\s+(.+)$/m)
                if (titleMatch) {
                    title = titleMatch[1]
                    // Remove the title from content to avoid duplication
                    content = content.replace(/^#\s+.+$/m, '').trim()
                } else {
                    title = slug
                }
            }

            // Default values for missing metadata
            const date = matterResult.data.date || new Date().toISOString().split('T')[0] // Fallback to today if missing
            const description = matterResult.data.description || content.slice(0, 150) + '...'
            const topics = matterResult.data.topics || []

            return {
                slug,
                title,
                date,
                description,
                topics,
                content,
            }
        })

    // Sort posts by date
    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1
        } else {
            return -1
        }
    })
}

export function getPostBySlug(slug: string): BlogPost | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`)
        // Check if file exists to avoid crash
        if (!fs.existsSync(fullPath)) {
            // Try decoding the slug in case it was URL encoded
            const decodedPath = path.join(postsDirectory, `${decodeURIComponent(slug)}.md`)
            if (!fs.existsSync(decodedPath)) {
                return null
            }
            const fileContents = fs.readFileSync(decodedPath, 'utf8')
            const matterResult = matter(fileContents)

            let title = matterResult.data.title
            let content = matterResult.content

            if (!title) {
                const titleMatch = content.match(/^#\s+(.+)$/m)
                if (titleMatch) {
                    title = titleMatch[1]
                    content = content.replace(/^#\s+.+$/m, '').trim()
                } else {
                    title = decodeURIComponent(slug)
                }
            }

            return {
                slug: decodeURIComponent(slug),
                title,
                date: matterResult.data.date || new Date().toISOString().split('T')[0],
                description: matterResult.data.description || content.slice(0, 150) + '...',
                topics: matterResult.data.topics || [],
                content,
            }
        }

        const fileContents = fs.readFileSync(fullPath, 'utf8')
        const matterResult = matter(fileContents)

        let title = matterResult.data.title
        let content = matterResult.content

        if (!title) {
            const titleMatch = content.match(/^#\s+(.+)$/m)
            if (titleMatch) {
                title = titleMatch[1]
                content = content.replace(/^#\s+.+$/m, '').trim()
            } else {
                title = slug
            }
        }

        return {
            slug,
            title,
            date: matterResult.data.date || new Date().toISOString().split('T')[0],
            description: matterResult.data.description || content.slice(0, 150) + '...',
            topics: matterResult.data.topics || [],
            content,
        }
    } catch (e) {
        return null
    }
}

export function getAllTopics(): Topic[] {
    const posts = getPosts()
    const topicCount: { [key: string]: number } = {}

    posts.forEach((post) => {
        post.topics.forEach((topic) => {
            if (topicCount[topic]) {
                topicCount[topic]++
            } else {
                topicCount[topic] = 1
            }
        })
    })

    return Object.keys(topicCount).map((topic) => ({
        name: topic,
        slug: topic.toLowerCase().replace(/\s+/g, '-'),
        count: topicCount[topic],
    })).sort((a, b) => b.count - a.count)
}
