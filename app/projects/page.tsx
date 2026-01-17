import { Metadata } from "next"
import Link from "next/link"
import { Github, Globe } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { getGithubRepos } from "@/lib/github"

export const metadata: Metadata = {
    title: "Projects | JYS Blog",
    description: "A collection of my technical projects.",
}

export default async function ProjectsPage() {
    const projects = await getGithubRepos()

    return (
        <div className="container mx-auto py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-5xl space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Projects</h1>
                    <p className="text-xl text-muted-foreground">
                        Open source contributions and personal projects.
                    </p>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">
                            No projects found. Please check your GitHub username configuration in <code>lib/github.ts</code>.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project, index) => (
                            <Card key={index} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{project.title}</CardTitle>
                                    <CardDescription className="mt-2 line-clamp-3">{project.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80"
                                            >
                                                {tag}
                                            </span>
                                        ))}
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
                )}
            </div>
        </div>
    )
}
