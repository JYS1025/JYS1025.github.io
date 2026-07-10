"use client"

import * as React from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

const ORDER: ("light" | "dark" | "system")[] = ["light", "dark", "system"]

export function ModeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => setMounted(true), [])

    const next = () => {
        const current = (ORDER.includes(theme as "light" | "dark" | "system") ? theme : "system") as "light" | "dark" | "system"
        const idx = ORDER.indexOf(current)
        setTheme(ORDER[(idx + 1) % ORDER.length])
    }

    const label = !mounted ? "Toggle theme" : theme === "dark" ? "Dark" : theme === "light" ? "Light" : "System"

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={next}
            aria-label={`Theme: ${label}. Click to change.`}
            title={`Theme: ${label}`}
        >
            {!mounted ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : theme === "dark" ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
            ) : theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
            ) : (
                <Monitor className="h-[1.2rem] w-[1.2rem]" />
            )}
            <span className="sr-only">{label}</span>
        </Button>
    )
}
