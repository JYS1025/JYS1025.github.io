import { Metadata } from "next"
import { notFound } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import rehypeSlug from "rehype-slug"
import rehypeKatex from "rehype-katex"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import "katex/dist/katex.min.css"
import "highlight.js/styles/github-dark.css"
import { getPosts, getPostBySlug } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Quote, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateStaticParams() {
    const posts = getPosts()
    return posts.map((post) => ({
        slug: post.slug,
    }))
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
        <article className="container mx-auto px-6 md:px-8 py-12 md:py-24 lg:py-32">
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
                    <h1 className="text-page-h1">{post.title}</h1>
                    <p className="flex items-center gap-2 text-muted-foreground text-lg">
                        <span>{post.date}</span>
                        <span aria-hidden="true" className="text-muted-foreground/50">·</span>
                        <span className="inline-flex items-center gap-1">
                            <Clock className="h-4 w-4" /> {post.readingTime} min read
                        </span>
                    </p>
                </div>

                <div className="prose prose-zinc dark:prose-invert prose-blog max-w-none">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeSlug, rehypeKatex, rehypeRaw, rehypeHighlight]}
                        components={{
                            p: ({ node, ...props }) => <p className="mb-8 leading-relaxed" {...props} />,
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="not-prose border-l-4 border-[hsl(var(--accent-strong))] pl-4 italic my-8 text-lg leading-relaxed text-muted-foreground" {...props} />
                            ),
                            h1: ({ node, ...props }) => <h1 className="font-display text-3xl font-semibold mt-12 mb-6 tracking-tight" {...props} />,
                            h2: ({ node, ...props }) => <h2 className="font-display text-2xl font-semibold mt-10 mb-5 tracking-tight" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="font-display text-xl font-semibold mt-8 mb-4 tracking-tight" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-6 mb-4" {...props} />,
                            ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-6 mb-4" {...props} />,
                            li: ({ node, ...props }) => <li className="mb-2" {...props} />,
                            code: ({ node, className, children, ...props }: any) => {
                                const match = /language-(\w+)/.exec(className || "")
                                const isInline = !match
                                return isInline ? (
                                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-[hsl(var(--accent-strong))]" {...props}>
                                        {children}
                                    </code>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                )
                            },
                            // @ts-ignore
                            aside: ({ node, ...props }) => (
                                <div className="not-prose rounded-lg border-l-4 border-[hsl(var(--accent-strong))] bg-muted/40 text-card-foreground shadow-sm p-6 flex gap-4 items-start">
                                    <Quote className="h-6 w-6 text-[hsl(var(--accent-strong))] shrink-0 mt-1" />
                                    <div className="prose dark:prose-invert prose-blog max-w-none flex-1">
                                        {props.children}
                                    </div>
                                </div>
                            ),
                            img: ({ node, ...props }) => (
                                <img className="rounded-lg border shadow-sm my-8 w-full" {...props} alt={props.alt || ""} />
                            ),
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
