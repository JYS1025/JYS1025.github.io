"use client"

import React, { useState } from "react"
import { Check, Copy, Terminal } from "lucide-react"
import { cn } from "@/lib/utils"

function extractText(node: React.ReactNode): string {
    if (!node) return ""
    if (typeof node === "string") return node
    if (typeof node === "number") return String(node)
    if (Array.isArray(node)) return node.map(extractText).join("")
    if (React.isValidElement(node) && node.props && (node.props as any).children) {
        return extractText((node.props as any).children)
    }
    return ""
}

const LANGUAGE_MAP: Record<string, string> = {
    js: "JavaScript",
    ts: "TypeScript",
    tsx: "TypeScript (TSX)",
    jsx: "JavaScript (JSX)",
    py: "Python",
    python: "Python",
    sh: "Shell",
    bash: "Bash",
    zsh: "Zsh",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    md: "Markdown",
    markdown: "Markdown",
    latex: "LaTeX",
    tex: "TeX",
    cpp: "C++",
    c: "C",
    rust: "Rust",
    rs: "Rust",
    scala: "Scala",
    sql: "SQL",
    yaml: "YAML",
    yml: "YAML",
}

export function CodeBlock({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) {
    const [copied, setCopied] = useState(false)

    // Find the code element inside children
    const codeElement = React.isValidElement(children) ? children : null
    const codeClassName = (codeElement?.props as any)?.className || className || ""

    // Extract language name from className (e.g., "language-python" or "hljs language-ts")
    const langMatch = codeClassName.match(/(?:language-|lang-)(\w+)/)
    const rawLang = langMatch ? langMatch[1] : ""
    const displayLanguage = rawLang ? (LANGUAGE_MAP[rawLang.toLowerCase()] || rawLang.toUpperCase()) : "Code"

    const rawText = extractText(children)

    const handleCopy = async () => {
        if (!rawText) return
        try {
            await navigator.clipboard.writeText(rawText.trim())
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy code:", err)
        }
    }

    return (
        <div className="not-prose my-6 overflow-hidden rounded-xl border border-border/80 bg-zinc-950 text-zinc-100 shadow-md">
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 bg-zinc-900/90 px-4 py-2 text-xs">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Terminal className="h-3.5 w-3.5 text-[hsl(var(--accent-strong))]" />
                    <span className="font-mono font-medium tracking-wide text-zinc-300">
                        {displayLanguage}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    aria-label="Copy code to clipboard"
                    className={cn(
                        "flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                        copied
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    )}
                >
                    {copied ? (
                        <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span>Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code Content */}
            <pre
                className={cn(
                    "overflow-x-auto p-4 font-mono text-[13.5px] leading-relaxed",
                    codeClassName
                )}
                {...props}
            >
                {children}
            </pre>
        </div>
    )
}
