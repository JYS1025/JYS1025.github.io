import { Metadata } from "next"
import { getPosts, getAllTopics } from "@/lib/posts"
import { PostList } from "@/components/blog/post-list"

export const metadata: Metadata = {
    title: "Blog | JYS Blog",
    description: "Read my latest thoughts and research updates.",
}

export default function BlogPage() {
    const posts = getPosts()
    const topics = getAllTopics()

    return (
        <div className="container mx-auto px-6 md:px-8 py-12 md:py-24 lg:py-32">
            <PostList posts={posts} topics={topics} />
        </div>
    )
}
