import { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

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
        <div className="container mx-auto py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
                    <p className="text-xl text-muted-foreground">
                        Thoughts, tutorials, and updates.
                    </p>
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
                <div className="grid gap-6">
                    {posts.map((post) => (
                        <Card key={post.slug}>
                            <CardHeader>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {post.topics.map((topicName) => (
                                        <Badge key={topicName} variant="outline">
                                            {topicName}
                                        </Badge>
                                    ))}
                                </div>
                                <CardTitle>{post.title}</CardTitle>
                                <CardDescription>{post.date}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{post.description}</p>
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
