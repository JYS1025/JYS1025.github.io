import { Metadata } from "next"
import Link from "next/link"
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
import { getPosts, getAllTopics } from "@/lib/posts"

export const metadata: Metadata = {
    title: "Blog | JYS Blog",
    description: "Read my latest thoughts and research updates.",
}

export default function BlogPage() {
    const posts = getPosts()
    const topics = getAllTopics()

    return (
        <div className="container mx-auto px-6 md:px-8 py-12 md:py-24 lg:py-32">
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
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic) => (
                                <Link key={topic.slug} href={`/blog/topic/${topic.slug}`}>
                                    <Badge variant="secondary" className="hover:bg-secondary/60">
                                        {topic.name} ({topic.count})
                                    </Badge>
                                </Link>
                            ))}
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
                        {topics.map((topic) => (
                            <Link key={topic.slug} href={`/blog/topic/${topic.slug}`}>
                                <Badge variant="secondary" className="hover:bg-secondary/60">
                                    {topic.name} ({topic.count})
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Right Main Content: Blog Posts Grid */}
                <div className="grid gap-6 sm:grid-cols-2">
                    {posts.map((post) => (
                        <Card key={post.slug} className="flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                            <CardHeader>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.topics.map((topicName) => (
                                        <Badge key={topicName} variant="outline">
                                            {topicName}
                                        </Badge>
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
        </div>
    )
}
