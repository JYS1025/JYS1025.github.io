"use client"

import { useState } from "react"
import Link from "next/link"
import { Github, Globe, FolderGit2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ListingHeader } from "@/components/layout/listing-header"
import { Project } from "@/lib/github"
import { cn } from "@/lib/utils"

function CategoryButton({
    active,
    onClick,
    label,
    count,
    full,
}: {
    active: boolean
    onClick: () => void
    label: string
    count: number
    full?: boolean
}) {
    return (
        <button
            onClick={onClick}
            aria-pressed={active}
            className={cn(
                "text-left transition-transform hover:scale-[1.02] active:scale-95",
                full ? "w-full" : "w-auto"
            )}
        >
            <Badge
                variant={active ? "default" : "secondary"}
                className={cn(
                    "px-3 py-1.5 text-sm transition-colors",
                    full && "w-full flex justify-between items-center",
                    active
                        ? "bg-[hsl(var(--accent-strong))] text-[hsl(var(--accent-strong-foreground))] shadow-md"
                        : "hover:bg-secondary/60"
                )}
            >
                <span>{label}</span>
                <span
                    className={cn(
                        "ml-2 text-xs px-1.5 py-0.5 rounded-full",
                        active
                            ? "bg-[hsl(var(--accent-strong-foreground))]/20 text-[hsl(var(--accent-strong-foreground))]"
                            : "bg-muted text-muted-foreground"
                    )}
                >
                    {count}
                </span>
            </Badge>
        </button>
    )
}

export function ProjectList({ projects }: { projects: Project[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All")

    const categoriesSet = new Set(projects.map((p) => p.category))
    const preferredOrder = ["AI & ML", "Tools & Web", "Others"]
    const availableCategories = Array.from(categoriesSet)
    const sortedCategories = availableCategories.sort((a, b) => {
        const idxA = preferredOrder.indexOf(a)
        const idxB = preferredOrder.indexOf(b)
        if (idxA !== -1 && idxB !== -1) return idxA - idxB
        if (idxA !== -1) return -1
        if (idxB !== -1) return 1
        return a.localeCompare(b)
    })

    const categories = ["All", ...sortedCategories]

    const filteredProjects = selectedCategory === "All"
        ? projects
        : projects.filter((p) => p.category === selectedCategory)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12 lg:gap-16 items-start">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-24 space-y-8">
                <ListingHeader title="Projects" description="Open source contributions and personal projects." />
                <div className="space-y-4">
                    <h2 className="text-section-h3 flex items-center">
                        <FolderGit2 className="mr-2 h-4 w-4" /> Categories
                    </h2>
                    <div className="flex flex-col gap-3 items-start">
                        {categories.map((category) => {
                            const count = category === "All"
                                ? projects.length
                                : projects.filter((p) => p.category === category).length
                            return (
                                <CategoryButton
                                    key={category}
                                    active={selectedCategory === category}
                                    onClick={() => setSelectedCategory(category)}
                                    label={category}
                                    count={count}
                                    full
                                />
                            )
                        })}
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="space-y-6 lg:hidden">
                <ListingHeader title="Projects" description="Open source contributions and personal projects." />
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => {
                        const count = category === "All"
                            ? projects.length
                            : projects.filter((p) => p.category === category).length
                        return (
                            <CategoryButton
                                key={category}
                                active={selectedCategory === category}
                                onClick={() => setSelectedCategory(category)}
                                label={`${category} (${count})`}
                                count={count}
                            />
                        )
                    })}
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
                {filteredProjects.map((project, index) => (
                    <Card
                        key={index}
                        className="flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[hsl(var(--accent-strong))]/50"
                    >
                        <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="mb-2">
                                    {project.category}
                                </Badge>
                            </div>
                            <CardTitle className="line-clamp-2">{project.title}</CardTitle>
                            <CardDescription className="mt-2 line-clamp-3">{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex flex-wrap gap-2">
                                {project.tags.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors bg-secondary text-secondary-foreground"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                {project.tags.length > 3 && (
                                    <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                                        +{project.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        </CardContent>
                        <div className="flex gap-2 p-6 pt-0">
                            <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link href={project.github} target="_blank" rel="noreferrer">
                                    <Github className="mr-2 h-4 w-4" />
                                    Code
                                </Link>
                            </Button>
                            {project.demo && (
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={project.demo} target="_blank" rel="noreferrer">
                                        <Globe className="mr-2 h-4 w-4" />
                                        Demo
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}
