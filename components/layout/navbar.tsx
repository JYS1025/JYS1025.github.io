"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface SearchTriggerProps {
    onClick: () => void
}

function SearchTrigger({ onClick }: SearchTriggerProps) {
    return (
        <Button
            variant="outline"
            className={cn(
                "relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2",
                "text-muted-foreground"
            )}
            onClick={onClick}
        >
            <Search className="h-4 w-4 xl:mr-2" />
            <span className="hidden xl:inline-flex">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                <span className="text-xs">⌘</span>K
            </kbd>
        </Button>
    )
}

const SearchDialog = dynamic(() => import("@/components/search-dialog"), {
    ssr: false,
})

const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Publications", href: "/publications" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [searchOpen, setSearchOpen] = React.useState(false)
    const pathname = usePathname()

    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
        setIsOpen(false)
    }

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setSearchOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                <div className="mr-4 hidden md:flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2" onClick={handleScrollToTop}>
                        <span className="hidden font-bold sm:inline-block">
                            JYS Blog
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "transition-colors hover:text-foreground/80",
                                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                                )}
                                onClick={handleScrollToTop}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center md:hidden">
                    <Link href="/" className="mr-6 flex items-center space-x-2" onClick={handleScrollToTop}>
                        <span className="font-bold">JYS1025</span>
                    </Link>
                    <Button
                        variant="ghost"
                        className="-mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </div>

                <div className="flex items-center justify-end space-x-2 md:flex-1">
                    <nav className="flex items-center gap-2">
                        <SearchTrigger onClick={() => setSearchOpen(true)} />
                        <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
                        <ModeToggle />
                    </nav>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b bg-background md:hidden"
                    >
                        <div className="container grid gap-4 p-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "text-sm font-medium transition-colors hover:text-primary",
                                        pathname === item.href ? "text-foreground" : "text-foreground/60"
                                    )}
                                    onClick={handleScrollToTop}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}
