"use client"

import { useEffect, useState } from "react"
import { ArrowUp, Check, Link as LinkIcon, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function FloatingActions() {
    const [showTopBtn, setShowTopBtn] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 350) {
                setShowTopBtn(true)
            } else {
                setShowTopBtn(false)
            }
        }

        window.addEventListener("scroll", handleScroll, { passive: true })
        handleScroll()

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy link:", err)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
            {/* Copy Link Feedback Toast */}
            <div
                className={cn(
                    "pointer-events-none rounded-lg border border-border/80 bg-background/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md transition-all duration-200",
                    copied ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                )}
            >
                <span className="flex items-center gap-1.5 text-emerald-500">
                    <Check className="h-3.5 w-3.5" />
                    Link copied!
                </span>
            </div>

            {/* Action Buttons Group */}
            <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background/80 p-1.5 shadow-lg backdrop-blur-md">
                {/* Share / Copy Link */}
                <button
                    onClick={copyLink}
                    aria-label="Copy link to post"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95"
                    title="Copy link"
                >
                    {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                    ) : (
                        <LinkIcon className="h-4 w-4" />
                    )}
                </button>

                {/* Back to Top */}
                {showTopBtn && (
                    <button
                        onClick={scrollToTop}
                        aria-label="Scroll back to top"
                        className="flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-all hover:bg-secondary hover:text-foreground active:scale-95 animate-in fade-in zoom-in-90 duration-200"
                        title="Back to top"
                    >
                        <ArrowUp className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    )
}
