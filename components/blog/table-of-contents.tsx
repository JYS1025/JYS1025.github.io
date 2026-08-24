"use client"

import { useEffect, useState } from "react"
import { ListOrdered } from "lucide-react"
import { cn } from "@/lib/utils"

interface TocItem {
    id: string
    text: string
    level: number
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<TocItem[]>([])
    const [activeId, setActiveId] = useState<string>("")

    useEffect(() => {
        // Query headings inside the markdown content area
        const elements = Array.from(
            document.querySelectorAll(".prose-blog h1, .prose-blog h2, .prose-blog h3")
        )

        const items: TocItem[] = elements
            .map((el) => {
                const id = el.id || el.textContent?.toLowerCase().replace(/\s+/g, "-") || ""
                if (!el.id && id) {
                    el.id = id
                }
                const level = el.tagName === "H1" ? 1 : el.tagName === "H2" ? 2 : 3
                return {
                    id,
                    text: el.textContent || "",
                    level,
                }
            })
            .filter((item) => item.text.trim().length > 0)

        setHeadings(items)

        if (items.length === 0) return

        // Scroll spy with IntersectionObserver
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries.filter((entry) => entry.isIntersecting)
                if (visibleEntries.length > 0) {
                    // Pick the entry closest to top
                    const sorted = visibleEntries.sort(
                        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
                    )
                    setActiveId(sorted[0].target.id)
                }
            },
            {
                rootMargin: "-80px 0% -60% 0%",
                threshold: [0, 1],
            }
        )

        elements.forEach((el) => observer.observe(el))

        return () => {
            observer.disconnect()
        }
    }, [])

    if (headings.length < 2) {
        return null
    }

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault()
        const element = document.getElementById(id)
        if (element) {
            const yOffset = -90 // Navbar offset
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
            window.scrollTo({ top: y, behavior: "smooth" })
            setActiveId(id)
            history.pushState(null, "", `#${id}`)
        }
    }

    return (
        <nav
            aria-label="Table of contents"
            className="space-y-3 text-sm"
        >
            <p className="font-display font-medium text-foreground flex items-center gap-2">
                <ListOrdered className="h-4 w-4 text-[hsl(var(--accent-strong))]" />
                On this page
            </p>
            <div className="border-l border-border pl-3 space-y-2 max-h-[calc(100vh-14rem)] overflow-y-auto pr-2">
                {headings.map((item) => {
                    const isActive = activeId === item.id
                    return (
                        <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => handleClick(e, item.id)}
                            className={cn(
                                "block transition-colors line-clamp-1 py-0.5",
                                item.level === 1 && "font-medium",
                                item.level === 2 && "pl-2 text-xs",
                                item.level === 3 && "pl-4 text-xs text-muted-foreground",
                                isActive
                                    ? "text-[hsl(var(--accent-strong))] font-medium -ml-[13px] pl-[12px] border-l-2 border-[hsl(var(--accent-strong))]"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {item.text}
                        </a>
                    )
                })}
            </div>
        </nav>
    )
}
