import Link from "next/link"
import { ArrowRight } from "lucide-react"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const topics = [
    { name: "Artificial Intelligence", href: "/blog?topic=Artificial Intelligence" },
    { name: "Neuroscience", href: "/blog?topic=Neuroscience" },
    { name: "Book Review", href: "/blog?topic=Book Review" },
    { name: "Essay", href: "/blog?topic=Essay" },
]

export function TopicLinks() {
    return (
        <Card className="border-border bg-background shadow-none">
            <CardHeader>
                <CardTitle className="text-subsection-h2">Topics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                {topics.map((topic) => (
                    <Link
                        key={topic.name}
                        href={topic.href}
                        className="group flex items-center justify-between rounded-md border border-transparent px-4 py-2.5 text-sm font-medium transition-colors hover:border-[hsl(var(--accent-strong))]/40 hover:bg-accent"
                    >
                        {topic.name}
                        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-[hsl(var(--accent-strong))]" />
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
