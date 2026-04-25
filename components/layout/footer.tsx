import { Github, Linkedin, Instagram, Mail } from "lucide-react"
import Link from "next/link"

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by Yoonseong Jeong. Hosted on GitHub Pages.
                </p>
                <div className="flex items-center gap-4">
                    <Link href="mailto:jys1025@kaist.ac.kr" target="_blank" rel="noreferrer">
                        <Mail className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                    <Link href="https://github.com/JYS1025" target="_blank" rel="noreferrer">
                        <Github className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                    <Link href="https://www.instagram.com/0dysse_ys/" target="_blank" rel="noreferrer">
                        <Instagram className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                    <Link href="https://www.linkedin.com/in/yoonseong-jeong-28943637b/" target="_blank" rel="noreferrer">
                        <Linkedin className="h-5 w-5 text-muted-foreground hover:text-foreground" />
                    </Link>
                </div>
            </div>
        </footer >
    )
}
