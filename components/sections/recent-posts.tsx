import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getPosts } from "@/lib/posts"

export async function RecentPosts() {
    const posts = getPosts()
    const recentPosts = posts.slice(0, 4)

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Recent Posts</h2>
                <Link
                    href="/blog"
                    className="flex items-center text-sm font-medium text-black dark:text-white hover:underline"
                >
                    View all posts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
            <div className="grid gap-6">
                {recentPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                        <Card className="flex flex-col justify-between h-full border-border bg-background shadow-none transition-colors group-hover:border-primary/50">
                            <CardHeader>
                                <CardTitle className="line-clamp-2 group-hover:underline">
                                    {post.title}
                                </CardTitle>
                                <CardDescription>{post.date}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-3 text-muted-foreground">
                                    {post.description}
                                </p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </section>
    )
}
