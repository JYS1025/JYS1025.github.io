import { Metadata } from "next"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeSlug from "rehype-slug"
import rehypeKatex from "rehype-katex"
import "katex/dist/katex.min.css"
import { getPosts, getPostBySlug } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    const posts = getPosts()
    console.log("Generated Slugs:", posts.map(p => p.slug))
    return posts.flatMap((post) => [
        { slug: post.slug },
        { slug: encodeURIComponent(post.slug) }
    ])
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        return {
            title: "Post Not Found",
        }
    }

    return {
        title: `${post.title} | JYS Blog`,
        description: post.description,
    }
}

export default async function PostPage({ params }: PageProps) {
    const { slug } = await params
    const post = getPostBySlug(slug)

    if (!post) {
        notFound()
    }

    return (
        <article className="container mx-auto py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-3xl space-y-8">
                <Link href="/blog">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Button>
                </Link>

                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {post.topics.map((topic) => (
                            <Badge key={topic} variant="secondary">
                                {topic}
                            </Badge>
                        ))}
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{post.title}</h1>
                    <p className="text-xl text-muted-foreground">{post.date}</p>
                </div>

                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeSlug, rehypeKatex]}
                        components={{
                            p: ({ node, ...props }) => <p className="mb-8 leading-relaxed" {...props} />,
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-primary pl-4 italic my-8" {...props} />
                            ),
                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-12 mb-6" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-10 mb-5" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-8 mb-4" {...props} />,
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-8">
                                    <table className="min-w-full divide-y divide-border" {...props} />
                                </div>
                            ),
                            th: ({ node, ...props }) => <th className="px-4 py-2 bg-muted font-semibold text-left" {...props} />,
                            td: ({ node, ...props }) => <td className="px-4 py-2 border-t border-border" {...props} />,
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>
            </div>
        </article>
    )
}
