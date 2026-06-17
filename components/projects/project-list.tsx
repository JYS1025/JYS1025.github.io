"use client"

import { useState } from "react"
import Link from "next/link"
import { Github, Globe, FolderGit2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Project } from "@/lib/github"

export function ProjectList({ projects }: { projects: Project[] }) {
    const [selectedCategory, setSelectedCategory] = useState<string>("All")

    // Get unique categories and calculate counts
    const categoriesSet = new Set(projects.map(p => p.category))
    // Hardcode preferred order for known categories, then sort the rest
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
        : projects.filter(p => p.category === selectedCategory)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12 lg:gap-16 items-start">
            {/* Sidebar Categories */}
            <div className="flex flex-col lg:sticky lg:top-24 space-y-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold flex items-center">
                        <FolderGit2 className="mr-2 h-4 w-4" /> Categories
                    </h2>
                    <div className="flex flex-wrap lg:flex-col gap-2 lg:gap-3 items-start">
                        {categories.map((category) => {
                            const count = category === "All" 
                                ? projects.length 
                                : projects.filter(p => p.category === category).length;
                            
                            const isSelected = selectedCategory === category;
                            
                            return (
                                <button 
                                    key={category} 
                                    onClick={() => setSelectedCategory(category)}
                                    className="text-left w-auto lg:w-full transition-transform hover:scale-105 active:scale-95"
                                >
                                    <Badge 
                                        variant={isSelected ? "default" : "secondary"} 
                                        className={`px-3 py-1.5 text-sm w-full flex justify-between items-center transition-colors ${isSelected ? "shadow-md" : "hover:bg-secondary/60"}`}
                                    >
                                        <span>{category}</span>
                                        <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${isSelected ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                                            {count}
                                        </span>
                                    </Badge>
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid gap-6 sm:grid-cols-2">
                {filteredProjects.map((project, index) => (
                    <Card key={index} className="flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300">
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
                        <CardFooter className="flex gap-2">
                            <Button variant="outline" size="sm" className="w-full" asChild>
                                <Link href={project.github} target="_blank">
                                    <Github className="mr-2 h-4 w-4" />
                                    Code
                                </Link>
                            </Button>
                            {project.demo && (
                                <Button variant="outline" size="sm" className="w-full" asChild>
                                    <Link href={project.demo} target="_blank">
                                        <Globe className="mr-2 h-4 w-4" />
                                        Demo
                                    </Link>
                                </Button>
                            )}
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}
