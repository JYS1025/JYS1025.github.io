import { Metadata } from "next"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
    title: "About",
    description: "About me and my research interests.",
}

export default function AboutPage() {
    return (
        <div className="container mx-auto px-6 md:px-8 py-12 md:py-24 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-12 lg:gap-24 items-start">
                
                {/* Left Sticky Column */}
                <div className="flex flex-col lg:sticky lg:top-24 space-y-6">
                    <div className="relative w-full max-w-sm mx-auto lg:max-w-full lg:mx-0">
                        <Image
                            src="/hero-image.webp"
                            alt="Profile Image"
                            width={500}
                            height={500}
                            className="h-auto w-full grayscale hide-on-dark rounded-xl shadow-sm"
                            priority
                        />
                        <Image
                            src="/hero-image-dark.webp"
                            alt="Profile Image (Dark Mode)"
                            width={500}
                            height={500}
                            className="h-auto w-full grayscale show-on-dark rounded-xl shadow-sm"
                            priority
                        />
                    </div>
                    <div className="space-y-2 text-center lg:text-left">
                        <h2 className="text-subsection-h2">Yoonseong Jeong</h2>
                        <p className="text-muted-foreground">Senior Undergraduate Student<br/>KAIST, School of Computing</p>
                    </div>
                </div>

                {/* Right Main Content Column */}
                <div className="space-y-12 max-w-3xl">
                    <div className="space-y-4">
                        <h1 className="text-page-h1 hidden lg:block">About Me</h1>
                        <p className="text-page-lead">
                            My goal is to understand the essence of intelligence through mathematical and biological lenses.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <section className="space-y-4">
                            <h2 className="text-subsection-h2 border-b pb-2">Research Interests</h2>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li>
                                    <strong className="text-foreground">Generative Models</strong>: Discrete Diffusion Language Models (DLMs), Score-based Generative Models.
                                </li>
                                <li>
                                    <strong className="text-foreground">Neuroscience & AGI</strong>: Bridging Brain Science (Neural Dynamics) and Artificial General Intelligence.
                                </li>
                                <li>
                                    <strong className="text-foreground">Mathematical Foundations</strong>: Information Geometry, Sampling Theory (DPM-Solver).
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subsection-h2 border-b pb-2">Honors & Awards</h2>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li>
                                    <strong className="text-foreground">KAIST Dean&apos;s List Honors</strong> (2025 Spring &amp; Fall, 2026 Spring)
                                </li>
                            </ul>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subsection-h2 border-b pb-2">Selected Publications</h2>
                            <div className="rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20 p-6 flex items-center gap-3 text-muted-foreground">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[hsl(var(--accent-strong))] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[hsl(var(--accent-strong))]"></span>
                                </span>
                                <span>Coming soon — recent publications will be added here.</span>
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-subsection-h2 border-b pb-2">Research Experience</h2>

                            <div className="relative border-l-2 border-border/70 ml-2 md:ml-3 pl-6 md:pl-8 space-y-6">
                                {/* ALIN Lab */}
                                <div className="relative group">
                                    <div className="absolute -left-[31px] md:-left-[39px] top-2 h-3.5 w-3.5 rounded-full border-2 border-background bg-[hsl(var(--accent-strong))] shadow-sm transition-transform group-hover:scale-125" />
                                    <div className="rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-[hsl(var(--accent-strong))]/50 hover:bg-card/70 hover:shadow-sm space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <h3 className="font-display text-lg font-semibold text-foreground tracking-tight group-hover:text-[hsl(var(--accent-strong))] transition-colors">
                                                Algorithmic Intelligence Lab (ALIN Lab)
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground bg-secondary/80 px-2.5 py-0.5 rounded-md">
                                                    2026.06 – Present
                                                </span>
                                                <Badge variant="outline" className="w-fit text-xs font-normal border-[hsl(var(--accent-strong))]/30 text-[hsl(var(--accent-strong))]">
                                                    KAIST
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Advisor: <span className="text-foreground font-medium">Prof. Jinwoo Shin</span>
                                        </p>
                                        <div className="space-y-1.5 text-sm text-muted-foreground border-t border-border/40 pt-3">
                                            <p>
                                                <strong className="text-foreground font-medium">Topic:</strong> On policy self-distillation for GUI Agent
                                            </p>
                                            <p className="text-muted-foreground/90">
                                                <strong className="text-foreground font-medium">Details:</strong> Investigating policy distillation and autonomous decision representations for interactive GUI agents.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* BigDyL Lab */}
                                <div className="relative group">
                                    <div className="absolute -left-[31px] md:-left-[39px] top-2 h-3.5 w-3.5 rounded-full border-2 border-background bg-[hsl(var(--accent-strong))] shadow-sm transition-transform group-hover:scale-125" />
                                    <div className="rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-[hsl(var(--accent-strong))]/50 hover:bg-card/70 hover:shadow-sm space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <h3 className="font-display text-lg font-semibold text-foreground tracking-tight group-hover:text-[hsl(var(--accent-strong))] transition-colors">
                                                Big Data Analytics and Learning Lab (BigDyL Lab)
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground bg-secondary/80 px-2.5 py-0.5 rounded-md">
                                                    2025.08 – 2026.05
                                                </span>
                                                <Badge variant="outline" className="w-fit text-xs font-normal border-[hsl(var(--accent-strong))]/30 text-[hsl(var(--accent-strong))]">
                                                    KAIST
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Advisor: <span className="text-foreground font-medium">Prof. Noseong Park</span>
                                        </p>
                                        <div className="space-y-1.5 text-sm text-muted-foreground border-t border-border/40 pt-3">
                                            <p>
                                                <strong className="text-foreground font-medium">Topic:</strong> Sampler Acceleration for Diffusion Language Models (DLMs)
                                            </p>
                                            <p className="text-muted-foreground/90">
                                                <strong className="text-foreground font-medium">Details:</strong> Designing high-order geometric and extrapolation sampling algorithms (e.g. Geodesic Momentum Sampling) for discrete diffusion language models.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* BMI Lab */}
                                <div className="relative group">
                                    <div className="absolute -left-[31px] md:-left-[39px] top-2 h-3.5 w-3.5 rounded-full border-2 border-background bg-[hsl(var(--accent-strong))] shadow-sm transition-transform group-hover:scale-125" />
                                    <div className="rounded-xl border border-border/70 bg-card/40 p-5 backdrop-blur-sm transition-all duration-200 hover:border-[hsl(var(--accent-strong))]/50 hover:bg-card/70 hover:shadow-sm space-y-3">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                            <h3 className="font-display text-lg font-semibold text-foreground tracking-tight group-hover:text-[hsl(var(--accent-strong))] transition-colors">
                                                Brain x Machine Intelligence Lab (BMI Lab)
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-medium text-muted-foreground bg-secondary/80 px-2.5 py-0.5 rounded-md">
                                                    2025.06 – 2025.08
                                                </span>
                                                <Badge variant="outline" className="w-fit text-xs font-normal border-[hsl(var(--accent-strong))]/30 text-[hsl(var(--accent-strong))]">
                                                    KAIST
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Advisor: <span className="text-foreground font-medium">Prof. Sang Wan Lee</span>
                                        </p>
                                        <div className="space-y-1.5 text-sm text-muted-foreground border-t border-border/40 pt-3">
                                            <p>
                                                <strong className="text-foreground font-medium">Topic:</strong> Decoding Cognitive States via Deep Neural Experimenter
                                            </p>
                                            <p className="text-muted-foreground/90">
                                                <strong className="text-foreground font-medium">Details:</strong> Visualized attention maps to analyze subject&rsquo;s cognitive decoding process. Studied the dynamics of cognitive states under One-shot and Incremental learning conditions.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subsection-h2 border-b pb-2">Tech Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                {["Python", "C++", "Rust", "Scala", "PyTorch", "HuggingFace", "SQL", "LaTeX"].map((tech) => (
                                    <span key={tech} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h2 className="text-subsection-h2 border-b pb-2">Personal Preferences</h2>
                            <p className="text-muted-foreground">I find inspiration in classical literature and philosophical discourse.</p>
                            <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                                <li><strong className="text-foreground">Philosophy</strong>: Kant (<em>Critique of Pure Reason</em>), Nietzsche, Camus, Foucault.</li>
                                <li><strong className="text-foreground">Literature</strong>: <em>The Sorrows of Young Werther</em>, <em>The Stranger</em>, <em>Siddhartha</em>, <em>The Judgment</em>, <em>Status Anxiety</em>.</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}
