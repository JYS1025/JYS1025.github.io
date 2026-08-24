import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'posts')

let ignoredFilesCache: Set<string> | null = null

/**
 * Batch-fetches all gitignored files in posts/ in a single command.
 * Avoids spawning dozens of subshells on every getPosts() call.
 */
function getIgnoredFiles(): Set<string> {
    if (ignoredFilesCache) return ignoredFilesCache
    ignoredFilesCache = new Set()
    try {
        const output = execSync('git status --ignored --porcelain=v1 posts/', {
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'ignore'],
        })
        output.split('\n').forEach((line) => {
            if (line.startsWith('!! ')) {
                let p = line.slice(3).trim()
                if (p.startsWith('"') && p.endsWith('"')) {
                    try {
                        p = JSON.parse(p)
                    } catch {}
                }
                const base = path.basename(p)
                ignoredFilesCache!.add(base.normalize('NFC'))
            }
        })
    } catch {
        // Fallback: treat as public if git is unavailable
    }
    return ignoredFilesCache
}

function isGitIgnored(fileName: string): boolean {
    const ignoredSet = getIgnoredFiles()
    return ignoredSet.has(fileName.normalize('NFC'))
}

export interface BlogPost {
    slug: string
    title: string
    date: string
    description: string
    topics: string[]
    content: string
    readingTime: number
}

export interface Topic {
    name: string
    slug: string
    count: number
}

/**
 * Estimate reading time in minutes from raw markdown content.
 * Uses 200 wpm and treats CJK characters (1 char ≈ 1 word) alongside
 * latin whitespace-delimited words so mixed-language posts still read
 * comfortably for the blog's audience.
 */
function estimateReadingTime(content: string): number {
    const cjk = (content.match(/[\u3400-\u9fff\uac00-\ud7af]/g) || []).length
    const words = content
        .replace(/[\u3400-\u9fff\uac00-\ud7af]/g, ' ')
        .split(/\s+/)
        .filter(Boolean).length
    const minutes = Math.max(1, Math.ceil((words + cjk) / 200))
    return minutes
}

let postsCache: BlogPost[] | null = null

export function getPosts(): BlogPost[] {
    if (postsCache && process.env.NODE_ENV === 'production') {
        return postsCache
    }

    // Get file names under /posts
    if (!fs.existsSync(postsDirectory)) {
        return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames
        .filter((fileName) => fileName.toLowerCase().endsWith('.md'))
        .filter((fileName) => !isGitIgnored(fileName))
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
            const readingTime = estimateReadingTime(content)

            return {
                slug,
                title,
                date,
                description,
                topics,
                content,
                readingTime,
            }
        })

    // Sort posts by date (newest first). Parse to Date so malformed or
    // non-ISO frontmatter values fall back gracefully rather than flipping
    // lexicographic order on edge cases.
    return allPostsData.sort((a, b) => {
        const ta = new Date(a.date).getTime()
        const tb = new Date(b.date).getTime()
        if (Number.isNaN(ta) && Number.isNaN(tb)) return 0
        if (Number.isNaN(ta)) return 1
        if (Number.isNaN(tb)) return -1
        return tb - ta
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

        // Block direct access to gitignored (confidential) posts even when
        // their slug is guessed — they must never render on the public site.
        const fileName = targetFileName || `${decodedSlug}.md`
        if (isGitIgnored(fileName)) {
            return null
        }

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
            readingTime: estimateReadingTime(content),
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

export interface PostNavigationInfo {
    prevPost: BlogPost | null
    nextPost: BlogPost | null
    relatedPosts: BlogPost[]
}

export function getPostNavigation(currentSlug: string): PostNavigationInfo {
    const posts = getPosts()
    const decodedSlug = decodeURIComponent(currentSlug).normalize('NFC')
    const currentIndex = posts.findIndex((p) => p.slug === decodedSlug)

    if (currentIndex === -1) {
        return { prevPost: null, nextPost: null, relatedPosts: [] }
    }

    const currentPost = posts[currentIndex]

    // Chronological order: posts are sorted newest first.
    // So nextPost (newer) is currentIndex - 1, prevPost (older) is currentIndex + 1.
    const nextPost = currentIndex > 0 ? posts[currentIndex - 1] : null
    const prevPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null

    // Related posts: posts with overlapping topics, excluding currentPost
    const relatedPosts = posts
        .filter((p) => p.slug !== currentPost.slug)
        .map((p) => {
            const sharedCount = p.topics.filter((t) => currentPost.topics.includes(t)).length
            return { post: p, sharedCount }
        })
        .filter((item) => item.sharedCount > 0)
        .sort((a, b) => b.sharedCount - a.sharedCount)
        .slice(0, 2)
        .map((item) => item.post)

    return {
        prevPost,
        nextPost,
        relatedPosts,
    }
}
