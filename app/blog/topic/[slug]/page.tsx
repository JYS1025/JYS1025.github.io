import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { notFound } from "next/navigation"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getPosts, getAllTopics } from "@/lib/posts"
import { Badge } from "@/components/ui/badge"

interface TopicPageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: TopicPageProps): Promise<Metadata> {
    const { slug } = await params
    const topics = getAllTopics()
    const topic = topics.find((t) => t.slug === slug)

    if (!topic) {
        return {
            title: "Topic Not Found",
        }
    }

    return {
        title: `${topic.name} | JYS Blog`,
        description: `Posts related to ${topic.name}.`,
    }
}

export async function generateStaticParams() {
    const topics = getAllTopics()
    return topics.map((topic) => ({
        slug: topic.slug,
    }))
}

export default async function TopicPage({ params }: TopicPageProps) {
    const { slug } = await params
    const topics = getAllTopics()
    const topic = topics.find((t) => t.slug === slug)

    if (!topic) {
        notFound()
    }

    const posts = getPosts()
    const filteredPosts = posts.filter((post) =>
        post.topics.some((t) => t === topic.name)
    )

    return (
        <div className="container mx-auto py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-3xl space-y-8">
                <div className="space-y-2">
                    <Link
                        href="/blog"
                        className="mb-4 flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{topic.name}</h1>
                    <p className="text-xl text-muted-foreground">
                        {filteredPosts.length} post{filteredPosts.length !== 1 && "s"} tagged with "{topic.name}"
                    </p>
                </div>
                <div className="grid gap-6">
                    {filteredPosts.length > 0 ? (
                        filteredPosts.map((post) => (
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
                        ))
                    ) : (
                        <p className="text-muted-foreground">No posts found for this topic.</p>
                    )}
                </div>
            </div>
        </div>
    )
}
