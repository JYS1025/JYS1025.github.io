"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowRight, Tag, Clock } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ListingHeader } from "@/components/layout/listing-header"
import { BlogPost, Topic } from "@/lib/posts"
import { cn } from "@/lib/utils"

function TopicButton({
    active,
    onClick,
    label,
    count,
    full,
}: {
    active: boolean
    onClick: () => void
    label: string
    count: number
    full?: boolean
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "text-left transition-transform hover:scale-[1.02] active:scale-95",
                full ? "w-full" : "w-auto"
            )}
        >
            <Badge
                variant={active ? "default" : "secondary"}
                className={cn(
                    "px-3 py-1.5 text-sm transition-colors",
                    full && "w-full flex justify-between items-center",
                    active
                        ? "bg-[hsl(var(--accent-strong))] text-[hsl(var(--accent-strong-foreground))] shadow-md"
                        : "hover:bg-secondary/60"
                )}
            >
                <span>{label}</span>
                <span
                    className={cn(
                        "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                        active
                            ? "bg-[hsl(var(--accent-strong-foreground))]/20 text-[hsl(var(--accent-strong-foreground))]"
                            : "bg-muted text-muted-foreground"
                    )}
                >
                    {count}
                </span>
            </Badge>
        </button>
    )
}

function PostListContent({ posts, topics }: { posts: BlogPost[], topics: Topic[] }) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const initialTopic = searchParams.get("topic") || "All"
    const [selectedTopic, setSelectedTopic] = useState<string>(initialTopic)

    useEffect(() => {
        const topic = searchParams.get("topic")
        if (topic) {
            setSelectedTopic(topic)
        }
    }, [searchParams])

    const handleSelectTopic = (topic: string) => {
        setSelectedTopic(topic)
        router.replace(`/blog${topic === "All" ? "" : `?topic=${encodeURIComponent(topic)}`}`, { scroll: false })
    }

    const filteredPosts = selectedTopic === "All"
        ? posts
        : posts.filter(p => p.topics.includes(selectedTopic))

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12 lg:gap-16 items-start">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-24 space-y-8">
                <ListingHeader title="Blog" description="Thoughts, tutorials, and research updates." />
                <div className="space-y-4">
                    <h2 className="text-section-h3 flex items-center">
                        <Tag className="mr-2 h-4 w-4" /> Topics
                    </h2>
                    <div className="flex flex-col gap-3 items-start">
                        <TopicButton
                            active={selectedTopic === "All"}
                            onClick={() => handleSelectTopic("All")}
                            label="All"
                            count={posts.length}
                            full
                        />
                        {topics.map((topic) => (
                            <TopicButton
                                key={topic.slug}
                                active={selectedTopic === topic.name}
                                onClick={() => handleSelectTopic(topic.name)}
                                label={topic.name}
                                count={topic.count}
                                full
                            />
                        ))}
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="space-y-6 lg:hidden">
                <ListingHeader title="Blog" description="Thoughts, tutorials, and research updates." />
                <div className="flex flex-wrap gap-2">
                    <TopicButton
                        active={selectedTopic === "All"}
                        onClick={() => handleSelectTopic("All")}
                        label={`All (${posts.length})`}
                        count={posts.length}
                    />
                    {topics.map((topic) => (
                        <TopicButton
                            key={topic.slug}
                            active={selectedTopic === topic.name}
                            onClick={() => handleSelectTopic(topic.name)}
                            label={`${topic.name} (${topic.count})`}
                            count={topic.count}
                        />
                    ))}
                </div>
            </div>

            {/* Right Main Content: Blog Posts Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
                {filteredPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block group h-full">
                        <Card className="flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[hsl(var(--accent-strong))]/50">
                            <CardHeader>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.topics.map((topicName) => (
                                        <button
                                            key={topicName}
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                handleSelectTopic(topicName)
                                            }}
                                        >
                                            <Badge variant="outline" className="hover:bg-secondary cursor-pointer">
                                                {topicName}
                                            </Badge>
                                        </button>
                                    ))}
                                </div>
                                <CardTitle className="line-clamp-2 group-hover:underline">{post.title}</CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <span>{post.date}</span>
                                    <span aria-hidden="true" className="text-muted-foreground/50">·</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {post.readingTime} min
                                    </span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground line-clamp-3">{post.description}</p>
                            </CardContent>
                            <CardFooter>
                                <span className="flex items-center text-sm font-medium text-[hsl(var(--accent-strong))]">
                                    Read more <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                                </span>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export function PostList({ posts, topics }: { posts: BlogPost[], topics: Topic[] }) {
    return (
        <Suspense fallback={<div className="container mx-auto p-12 text-center text-muted-foreground">Loading blog posts...</div>}>
            <PostListContent posts={posts} topics={topics} />
        </Suspense>
    )
}
