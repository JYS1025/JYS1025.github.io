"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroProps {
    align?: "center" | "left"
}

export function Hero({ align = "center" }: HeroProps) {
    return (
        <section
            className={cn(
                "container mx-auto flex flex-col justify-center space-y-8",
                align === "center"
                    ? "py-12 md:py-24 lg:py-32 items-center text-center min-h-[calc(100vh-4rem)]"
                    : "py-0 items-start text-left"
            )}
        >
            {align === "left" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-8 w-full max-w-md mx-auto"
                >
                    <Image
                        src="/hero-image.png"
                        alt="Hero Image"
                        width={500}
                        height={500}
                        className="h-auto w-full grayscale hide-on-dark"
                        priority
                    />
                    <Image
                        src="/hero-image-dark.png"
                        alt="Hero Image (Dark Mode)"
                        width={500}
                        height={500}
                        className="h-auto w-full grayscale show-on-dark"
                        priority
                    />
                </motion.div>
            )}

            <div className="space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
                >
                    Hi, I'm Yoonseong Jeong
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className={cn(
                        "max-w-[700px] text-muted-foreground md:text-xl",
                        align === "center" && "mx-auto"
                    )}
                >
                    <span className="font-bold block mb-2">Senior Undergraduate Student @ KAIST, School of Computing</span>
                    Exploring the mathematical foundations of Generative AI & General Intelligence
                </motion.p>
            </div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
            >
                <Button asChild variant="secondary" size="lg" className="h-12 px-8 text-base">
                    <Link href="/projects">
                        View Projects <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base backdrop-blur-sm bg-background/50 hover:bg-background/80">
                    <Link href="/resume.pdf" target="_blank">
                        Download Resume <Download className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </motion.div>
        </section>
    )
}
