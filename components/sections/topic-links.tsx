import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const topics = [
    { name: "Artificial Intelligence", href: "/blog?topic=Artificial Intelligence" },
    { name: "Reinforcement Learning", href: "/blog?topic=Reinforcement Learning" },
    { name: "Neuroscience", href: "/blog?topic=Neuroscience" },
    { name: "Computer Science", href: "/blog?topic=Computer Science" },
    { name: "Philosophy", href: "/blog?topic=Philosophy" },
    { name: "Book Review", href: "/blog?topic=Book Review" },
    { name: "Essay", href: "/blog?topic=Essay" },
]

export function TopicLinks() {
    return (
        <Card className="border-border bg-background shadow-none">
            <CardHeader>
                <CardTitle>Topics</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
                {topics.map((topic) => (
                    <Button
                        key={topic.name}
                        variant="outline"
                        className="justify-between hover:bg-accent hover:text-accent-foreground"
                        asChild
                    >
                        <Link href={topic.href}>
                            {topic.name}
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
}
