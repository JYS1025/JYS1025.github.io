"use client"

import { useEffect, useState } from "react"

export function ReadingProgressBar() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        let ticking = false

        const updateProgress = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
            if (docHeight > 0) {
                const scrolled = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
                setProgress(scrolled)
            }
            ticking = false
        }

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateProgress)
                ticking = true
            }
        }

        window.addEventListener("scroll", onScroll, { passive: true })
        updateProgress()

        return () => {
            window.removeEventListener("scroll", onScroll)
        }
    }, [])

    if (progress <= 0) return null

    return (
        <div
            aria-hidden="true"
            className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-transparent pointer-events-none"
        >
            <div
                className="h-full bg-gradient-to-r from-[hsl(var(--accent-strong))]/70 to-[hsl(var(--accent-strong))] transition-all duration-150 ease-out shadow-[0_0_8px_hsl(var(--accent-strong))]"
                style={{ width: `${progress}%` }}
            />
        </div>
    )
}
