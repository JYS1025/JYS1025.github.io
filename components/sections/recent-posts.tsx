import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

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
                <h2 className="text-section-h2">Recent Posts</h2>
                <Link
                    href="/blog"
                    className="flex items-center text-sm font-medium text-[hsl(var(--accent-strong))] hover:underline"
                >
                    View all posts <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
            </div>
            <div className="grid gap-6">
                {recentPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="block group h-full">
                        <Card className="flex flex-col justify-between h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[hsl(var(--accent-strong))]/50">
                            <CardHeader>
                                <CardTitle className="line-clamp-2 group-hover:underline">
                                    {post.title}
                                </CardTitle>
                                <CardDescription className="flex items-center gap-2">
                                    <span>{post.date}</span>
                                    <span aria-hidden="true" className="text-muted-foreground/50">·</span>
                                    <span className="inline-flex items-center gap-1">
                                        <Clock className="h-3 w-3" /> {post.readingTime} min
                                    </span>
                                </CardDescription>
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
