"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { MessageSquare } from "lucide-react"

interface GiscusCommentsProps {
    repo?: string
    repoId?: string
    category?: string
    categoryId?: string
}

export function GiscusComments({
    repo = "JYS1025/JYS1025.github.io",
    repoId = "R_kgDOQ7shyg",
    category = "General",
    categoryId = "DIC_kwDOQ7shys4DEDLT",
}: GiscusCommentsProps) {
    const ref = useRef<HTMLDivElement>(null)
    const { resolvedTheme } = useTheme()
    const [isVisible, setIsVisible] = useState(false)
    const isMounted = useRef(false)

    useEffect(() => {
        if (!ref.current) return
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { rootMargin: "300px" }
        )
        observer.observe(ref.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!ref.current || !isVisible) return

        const theme = resolvedTheme === "dark" ? "github-dark" : "light"

        // If already loaded, smoothly update theme via postMessage
        if (isMounted.current) {
            const iframe = ref.current.querySelector<HTMLIFrameElement>("iframe.giscus-frame")
            if (iframe?.contentWindow) {
                iframe.contentWindow.postMessage(
                    { giscus: { setConfig: { theme } } },
                    "https://giscus.app"
                )
                return
            }
        }

        // Initial mount
        ref.current.innerHTML = ""
        const script = document.createElement("script")
        script.src = "https://giscus.app/client.js"
        script.setAttribute("data-repo", repo)
        script.setAttribute("data-repo-id", repoId)
        script.setAttribute("data-category", category)
        script.setAttribute("data-category-id", categoryId)
        script.setAttribute("data-mapping", "pathname")
        script.setAttribute("data-strict", "0")
        script.setAttribute("data-reactions-enabled", "1")
        script.setAttribute("data-emit-metadata", "0")
        script.setAttribute("data-input-position", "bottom")
        script.setAttribute("data-theme", theme)
        script.setAttribute("data-lang", "en")
        script.setAttribute("crossorigin", "anonymous")
        script.async = true

        ref.current.appendChild(script)
        isMounted.current = true
    }, [isVisible, resolvedTheme, repo, repoId, category, categoryId])

    return (
        <section className="mt-16 pt-8 border-t border-border space-y-6">
            <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[hsl(var(--accent-strong))]" />
                <h3 className="font-display text-lg font-semibold tracking-tight">
                    Comments & Discussion
                </h3>
            </div>
            <div ref={ref} className="min-h-[160px] giscus-container" />
        </section>
    )
}
