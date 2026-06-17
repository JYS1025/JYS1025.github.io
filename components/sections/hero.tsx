"use client"


import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Download } from "lucide-react"
import { NeuralNetwork } from "@/components/ui/neural-network"

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
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="w-full mb-8 h-[250px] sm:h-[300px] lg:h-[350px]"
                >
                    <NeuralNetwork />
                </motion.div>
            )}

            <div className="space-y-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: align === "left" ? 0.2 : 0 }}
                    className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl"
                >
                    Hi, I'm Yoonseong Jeong
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: align === "left" ? 0.4 : 0.2 }}
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
                transition={{ duration: 0.5, delay: align === "left" ? 0.6 : 0.4 }}
                className={cn(
                    "flex flex-col w-full space-y-4 sm:w-auto sm:flex-row sm:space-x-4 sm:space-y-0",
                    align === "center" ? "items-center justify-center" : "items-start"
                )}
            >
                <Button asChild variant="secondary" size="lg" className="h-12 w-full sm:w-auto px-8 text-base">
                    <Link href="/projects">
                        View Projects <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="h-12 w-full sm:w-auto px-8 text-base backdrop-blur-sm bg-background/50 hover:bg-background/80">
                    <Link href="/resume.pdf" target="_blank">
                        Download Resume <Download className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </motion.div>
        </section>
    )
}
