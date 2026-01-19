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
        .filter((fileName) => fileName.toLowerCase().endsWith('.md'))
        .map((fileName) => {
            // Remove ".md" (case insensitive) from file name to get slug
            const slug = fileName.replace(/\.md$/i, '').normalize('NFC')

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

// Cache for slug to filename mapping
let slugMapCache: Map<string, string> | null = null

function getSlugMap(): Map<string, string> {
    if (slugMapCache) return slugMapCache

    slugMapCache = new Map()
    if (!fs.existsSync(postsDirectory)) return slugMapCache

    const fileNames = fs.readdirSync(postsDirectory)
    fileNames.forEach(fileName => {
        if (!fileName.toLowerCase().endsWith('.md')) return
        const slug = fileName.replace(/\.md$/i, '').normalize('NFC')
        slugMapCache!.set(slug, fileName)
    })

    return slugMapCache
}

export function getPostBySlug(slug: string): BlogPost | null {
    try {
        const decodedSlug = decodeURIComponent(slug).normalize('NFC')
        const slugMap = getSlugMap()

        // 1. Try direct lookup from cache (O(1))
        let targetFileName = slugMap.get(decodedSlug)
        let fullPath: string

        if (targetFileName) {
            fullPath = path.join(postsDirectory, targetFileName)
        } else {
            // Fallback: Check if file exists directly (in case cache is stale or for direct access)
            // This handles cases where slug might be the filename itself
            const directPath = path.join(postsDirectory, `${decodedSlug}.md`)
            if (fs.existsSync(directPath)) {
                fullPath = directPath
            } else {
                return null
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
                title = decodedSlug
            }
        }

        return {
            slug: decodedSlug,
            title,
            date: matterResult.data.date || new Date().toISOString().split('T')[0],
            description: matterResult.data.description || content.slice(0, 150) + '...',
            topics: matterResult.data.topics || [],
            content,
        }
    } catch (e) {
        console.error("Error in getPostBySlug:", e)
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
