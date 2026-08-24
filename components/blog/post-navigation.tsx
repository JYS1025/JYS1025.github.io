import Link from "next/link"
import { ArrowLeft, ArrowRight, Clock } from "lucide-react"
import { BlogPost } from "@/lib/posts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface PostNavigationProps {
    prevPost: BlogPost | null
    nextPost: BlogPost | null
    relatedPosts?: BlogPost[]
}

export function PostNavigation({ prevPost, nextPost, relatedPosts = [] }: PostNavigationProps) {
    return (
        <div className="space-y-12 pt-8 border-t border-border mt-16">
            {/* Adjacent Posts Navigation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost ? (
                    <Link href={`/blog/${prevPost.slug}`} className="group block h-full">
                        <Card className="h-full p-5 flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[hsl(var(--accent-strong))]/50">
                            <div className="space-y-2">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-[hsl(var(--accent-strong))] transition-colors">
                                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
                                    <span>Previous Post</span>
                                </div>
                                <h4 className="font-display text-base font-semibold leading-snug line-clamp-2 group-hover:underline">
                                    {prevPost.title}
                                </h4>
                            </div>
                            <p className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                                <span>{prevPost.date}</span>
                                <span>·</span>
                                <span>{prevPost.readingTime} min</span>
                            </p>
                        </Card>
                    </Link>
                ) : (
                    <div className="hidden sm:block" />
                )}

                {nextPost ? (
                    <Link href={`/blog/${nextPost.slug}`} className="group block h-full text-right sm:text-right">
                        <Card className="h-full p-5 flex flex-col justify-between items-end transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[hsl(var(--accent-strong))]/50">
                            <div className="space-y-2 w-full">
                                <div className="flex items-center justify-end gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-[hsl(var(--accent-strong))] transition-colors">
                                    <span>Next Post</span>
                                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                                </div>
                                <h4 className="font-display text-base font-semibold leading-snug line-clamp-2 group-hover:underline">
                                    {nextPost.title}
                                </h4>
                            </div>
                            <p className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                                <span>{nextPost.date}</span>
                                <span>·</span>
                                <span>{nextPost.readingTime} min</span>
                            </p>
                        </Card>
                    </Link>
                ) : (
                    <div className="hidden sm:block" />
                )}
            </div>

            {/* Related Posts Section */}
            {relatedPosts.length > 0 && (
                <div className="space-y-4 pt-4">
                    <h3 className="font-display text-lg font-semibold tracking-tight">
                        Related Posts
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {relatedPosts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group block h-full">
                                <Card className="h-full flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-[hsl(var(--accent-strong))]/50">
                                    <CardHeader className="p-5 pb-3">
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {post.topics.slice(0, 2).map((topic) => (
                                                <Badge key={topic} variant="secondary" className="text-[11px] px-2 py-0.5">
                                                    {topic}
                                                </Badge>
                                            ))}
                                        </div>
                                        <CardTitle className="text-base font-semibold line-clamp-2 group-hover:underline">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription className="text-xs flex items-center gap-2 mt-1">
                                            <span>{post.date}</span>
                                            <span>·</span>
                                            <span className="inline-flex items-center gap-1">
                                                <Clock className="h-3 w-3" /> {post.readingTime} min
                                            </span>
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-5 pt-0">
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {post.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
