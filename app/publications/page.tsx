import { Metadata } from "next"
import Link from "next/link"
import { ExternalLink, FileText } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = {
    title: "Publications | JYS Blog",
    description: "My academic publications and research papers.",
}

/*
const publications = [
    {
        title: "Deep Learning for Autonomous Navigation in Complex Environments",
        authors: "Smith, J., Doe, A., & Johnson, B.",
        venue: "CVPR 2024",
        year: 2024,
        abstract: "We propose a novel architecture for robust navigation...",
        link: "#",
        pdf: "#",
    },
    {
        title: "Attention Mechanisms in Reinforcement Learning",
        authors: "Doe, A., & Smith, J.",
        venue: "NeurIPS 2023",
        year: 2023,
        abstract: "This paper explores the impact of self-attention...",
        link: "#",
        pdf: "#",
    },
    {
        title: "Generative Adversarial Networks for Image Synthesis",
        authors: "Johnson, B., Doe, A., & Lee, C.",
        venue: "ICCV 2023",
        year: 2023,
        abstract: "A new GAN framework that improves stability...",
        link: "#",
        pdf: "#",
    },
]
*/

export default function PublicationsPage() {
    return (
        <div className="container mx-auto py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-4xl space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Publications</h1>
                    <p className="text-xl text-muted-foreground">
                        Selected research papers and conference proceedings.
                    </p>
                </div>

                <div className="py-12 text-center">
                    <p className="text-xl text-muted-foreground">
                        No publications yet.
                    </p>
                </div>

                {/* 
                <div className="grid gap-6">
                    {publications.map((pub, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">{pub.title}</CardTitle>
                                        <CardDescription className="text-base font-medium text-foreground">
                                            {pub.authors}
                                        </CardDescription>
                                        <CardDescription>
                                            {pub.venue}, {pub.year}
                                        </CardDescription>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="icon" asChild>
                                            <Link href={pub.link} target="_blank">
                                                <ExternalLink className="h-4 w-4" />
                                                <span className="sr-only">View</span>
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="icon" asChild>
                                            <Link href={pub.pdf} target="_blank">
                                                <FileText className="h-4 w-4" />
                                                <span className="sr-only">PDF</span>
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{pub.abstract}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div> 
                */}
            </div>
        </div>
    )
}
