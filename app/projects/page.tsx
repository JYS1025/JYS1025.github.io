import { Metadata } from "next"
import { getGithubRepos } from "@/lib/github"
import { ProjectList } from "@/components/projects/project-list"

export const metadata: Metadata = {
    title: "Projects | JYS Blog",
    description: "A collection of my technical projects.",
}

export default async function ProjectsPage() {
    const projects = await getGithubRepos()

    return (
        <div className="container mx-auto px-6 md:px-8 py-12 md:py-24 lg:py-32">
            <div className="grid grid-cols-1 gap-12 items-start">
                <div className="space-y-4">
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
                    <ProjectList projects={projects} />
                )}
            </div>
        </div>
    )
}
