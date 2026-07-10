import { Github, Linkedin, Instagram, Mail } from "lucide-react"
import Link from "next/link"

const socials = [
    { href: "mailto:jys1025@kaist.ac.kr", label: "Email", Icon: Mail },
    { href: "https://github.com/JYS1025", label: "GitHub", Icon: Github },
    { href: "https://www.instagram.com/0dysse_ys/", label: "Instagram", Icon: Instagram },
    { href: "https://www.linkedin.com/in/yoonseong-jeong-28943637b/", label: "LinkedIn", Icon: Linkedin },
]

export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    Built by Yoonseong Jeong. Hosted on GitHub Pages.
                </p>
                <div className="flex items-center gap-4">
                    {socials.map(({ href, label, Icon }) => (
                        <Link
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={label}
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <Icon className="h-5 w-5" />
                        </Link>
                    ))}
                </div>
            </div>
        </footer >
    )
}
