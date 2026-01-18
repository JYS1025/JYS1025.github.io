"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import { Search, FileText, Github, BookOpen } from "lucide-react"

import Fuse from "fuse.js"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface SearchResult {
    type: 'Post' | 'Project' | 'Publication'
    title: string
    description: string
    tags: string[]
    url: string
    date: string
}

export function SearchCommand() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const router = useRouter()

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    React.useEffect(() => {
        if (open && results.length === 0) {
            fetch("/search.json")
                .then((res) => res.json())
                .then((data) => setResults(data))
                .catch((err) => console.error("Failed to load search index:", err))
        }
    }, [open, results.length])

    const fuse = React.useMemo(() => {
        return new Fuse(results, {
            keys: [
                { name: 'title', weight: 0.7 },
                { name: 'description', weight: 0.3 },
                'tags'
            ],
            threshold: 0.4, // 0.0 = exact match, 1.0 = match anything
            includeScore: true,
        })
    }, [results])

    const filteredResults = React.useMemo(() => {
        if (!query) return []
        return fuse.search(query).map(result => result.item).slice(0, 10)
    }, [query, fuse])

    const runCommand = React.useCallback((command: () => unknown) => {
        setOpen(false)
        command()
    }, [])

    return (
        <>
            <Button
                variant="outline"
                className={cn(
                    "relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2",
                    "text-muted-foreground"
                )}
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Search...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="overflow-hidden p-0 shadow-lg">
                    <DialogHeader className="px-4 pb-0 pt-4">
                        <DialogTitle className="sr-only">Search</DialogTitle>
                    </DialogHeader>
                    <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
                        <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <Command.Input
                                placeholder="Type a command or search..."
                                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                                value={query}
                                onValueChange={setQuery}
                            />
                        </div>
                        <Command.List className="max-h-[500px] overflow-y-auto overflow-x-hidden">
                            <Command.Empty className="py-6 text-center text-sm">No results found.</Command.Empty>

                            {/* Blog Posts */}
                            {filteredResults.some(item => item.type === 'Post') && (
                                <Command.Group heading="Blog Posts">
                                    {filteredResults.filter(item => item.type === 'Post').map((item) => (
                                        <Command.Item
                                            key={item.url}
                                            value={`${item.title} ${item.description} ${item.tags.join(' ')}`}
                                            onSelect={() => {
                                                runCommand(() => {
                                                    router.push(item.url)
                                                })
                                            }}
                                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                        >
                                            <FileText className="mr-2 h-4 w-4 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                                            </div>
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            )}

                            {/* Projects */}
                            {filteredResults.some(item => item.type === 'Project') && (
                                <Command.Group heading="Projects">
                                    {filteredResults.filter(item => item.type === 'Project').map((item) => (
                                        <Command.Item
                                            key={item.url}
                                            value={`${item.title} ${item.description} ${item.tags.join(' ')}`}
                                            onSelect={() => {
                                                runCommand(() => {
                                                    window.open(item.url, "_blank")
                                                })
                                            }}
                                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                        >
                                            <Github className="mr-2 h-4 w-4 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                                            </div>
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            )}

                            {/* Publications */}
                            {filteredResults.some(item => item.type === 'Publication') && (
                                <Command.Group heading="Publications">
                                    {filteredResults.filter(item => item.type === 'Publication').map((item) => (
                                        <Command.Item
                                            key={item.url}
                                            value={`${item.title} ${item.description} ${item.tags.join(' ')}`}
                                            onSelect={() => {
                                                runCommand(() => {
                                                    window.open(item.url, "_blank")
                                                })
                                            }}
                                            className="relative flex cursor-default select-none items-center rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                                        >
                                            <BookOpen className="mr-2 h-4 w-4 shrink-0" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{item.title}</span>
                                                <span className="text-xs text-muted-foreground line-clamp-1">{item.description}</span>
                                            </div>
                                        </Command.Item>
                                    ))}
                                </Command.Group>
                            )}
                        </Command.List>
                    </Command>
                </DialogContent>
            </Dialog>
        </>
    )
}
