import Link from "next/link"
import { ArrowUpRight, Brain, Cpu, BookOpen, PenTool } from "lucide-react"
import { getAllTopics } from "@/lib/posts"

const TOPIC_CONFIG = [
    {
        name: "Artificial Intelligence",
        icon: Cpu,
        description: "Generative Models, DLMs, SBMs",
    },
    {
        name: "Neuroscience",
        icon: Brain,
        description: "Neural Dynamics, Cognitive Decoding",
    },
    {
        name: "Book Review",
        icon: BookOpen,
        description: "Literature, Philosophy, Reflections",
    },
    {
        name: "Essay",
        icon: PenTool,
        description: "Thoughts on Intelligence & Life",
    },
]

export function TopicLinks() {
    const allTopics = getAllTopics()
    const topicCountMap = new Map(allTopics.map((t) => [t.name, t.count]))

    return (
        <section className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-section-h2">Topics</h2>
                <Link
                    href="/blog"
                    className="text-xs font-medium text-muted-foreground hover:text-[hsl(var(--accent-strong))] transition-colors"
                >
                    Browse all
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {TOPIC_CONFIG.map(({ name, icon: Icon, description }) => {
                    const count = topicCountMap.get(name) || 0
                    return (
                        <Link
                            key={name}
                            href={`/blog?topic=${encodeURIComponent(name)}`}
                            className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/60 p-4 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--accent-strong))]/60 hover:shadow-md hover:shadow-[hsl(var(--accent-strong))]/5"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/80 text-foreground transition-colors group-hover:bg-[hsl(var(--accent-strong))]/15 group-hover:text-[hsl(var(--accent-strong))]">
                                        <Icon className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-[hsl(var(--accent-strong))]">
                                            {name}
                                        </h3>
                                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                                            {description}
                                        </p>
                                    </div>
                                </div>
                                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[hsl(var(--accent-strong))] group-hover:opacity-100" />
                            </div>

                            <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5 text-[11px] text-muted-foreground">
                                <span>Explore topic</span>
                                <span className="rounded-full bg-secondary/60 px-2 py-0.5 font-mono text-[10px] font-medium text-secondary-foreground group-hover:bg-[hsl(var(--accent-strong))]/15 group-hover:text-[hsl(var(--accent-strong))] transition-colors">
                                    {count} {count === 1 ? "post" : "posts"}
                                </span>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </section>
    )
}
