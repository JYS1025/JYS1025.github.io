"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ArrowRight, Tag } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BlogPost, Topic } from "@/lib/posts"

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
            {/* Left Sidebar: Topics */}
            <div className="flex flex-col lg:sticky lg:top-24 space-y-8 hidden lg:flex">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
                    <p className="text-muted-foreground">Thoughts, tutorials, and research updates.</p>
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center">
                        <Tag className="mr-2 h-4 w-4" /> Topics
                    </h2>
                    <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-3 items-start">
                        <button
                            onClick={() => handleSelectTopic("All")}
                            className="text-left w-auto lg:w-full transition-transform hover:scale-105 active:scale-95"
                        >
                            <Badge
                                variant={selectedTopic === "All" ? "default" : "secondary"}
                                className={`px-3 py-1.5 text-sm w-full flex justify-between items-center transition-colors ${selectedTopic === "All" ? "shadow-md" : "hover:bg-secondary/60"}`}
                            >
                                <span>All</span>
                                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${selectedTopic === "All" ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                    {posts.length}
                                </span>
                            </Badge>
                        </button>
                        {topics.map((topic) => {
                            const isSelected = selectedTopic === topic.name;
                            return (
                                <button
                                    key={topic.slug}
                                    onClick={() => handleSelectTopic(topic.name)}
                                    className="text-left w-auto lg:w-full transition-transform hover:scale-105 active:scale-95"
                                >
                                    <Badge
                                        variant={isSelected ? "default" : "secondary"}
                                        className={`px-3 py-1.5 text-sm w-full flex justify-between items-center transition-colors ${isSelected ? "shadow-md" : "hover:bg-secondary/60"}`}
                                    >
                                        <span>{topic.name}</span>
                                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            {topic.count}
                                        </span>
                                    </Badge>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Mobile Header (Visible only on small screens) */}
            <div className="space-y-6 lg:hidden">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
                    <p className="text-xl text-muted-foreground">Thoughts, tutorials, and research updates.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button onClick={() => handleSelectTopic("All")}>
                        <Badge
                            variant={selectedTopic === "All" ? "default" : "secondary"}
                            className={`px-3 py-1 text-sm transition-colors ${selectedTopic === "All" ? "shadow-md" : "hover:bg-secondary/60"}`}
                        >
                            All ({posts.length})
                        </Badge>
                    </button>
                    {topics.map((topic) => {
                        const isSelected = selectedTopic === topic.name;
                        return (
                            <button key={topic.slug} onClick={() => handleSelectTopic(topic.name)}>
                                <Badge
                                    variant={isSelected ? "default" : "secondary"}
                                    className={`px-3 py-1 text-sm transition-colors ${isSelected ? "shadow-md" : "hover:bg-secondary/60"}`}
                                >
                                    {topic.name} ({topic.count})
                                </Badge>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Right Main Content: Blog Posts Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
                {filteredPosts.map((post) => (
                    <Card key={post.slug} className="flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <CardHeader>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {post.topics.map((topicName) => (
                                    <button 
                                        key={topicName} 
                                        onClick={(e) => {
                                            e.preventDefault(); // Prevent accidental navigation if nested later
                                            handleSelectTopic(topicName);
                                        }}
                                    >
                                        <Badge variant="outline" className="hover:bg-secondary cursor-pointer">
                                            {topicName}
                                        </Badge>
                                    </button>
                                ))}
                            </div>
                            <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                            <CardDescription>{post.date}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <p className="text-muted-foreground line-clamp-3">{post.description}</p>
                        </CardContent>
                        <CardFooter>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="flex items-center text-sm font-medium text-primary hover:underline"
                            >
                                Read more <ArrowRight className="ml-1 h-4 w-4" />
                            </Link>
                        </CardFooter>
                    </Card>
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
