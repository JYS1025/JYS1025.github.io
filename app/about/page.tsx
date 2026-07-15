import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
    title: "About | JYS Blog",
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
                            src="/hero-image.png"
                            alt="Profile Image"
                            width={500}
                            height={500}
                            className="h-auto w-full grayscale hide-on-dark rounded-xl shadow-sm"
                            priority
                        />
                        <Image
                            src="/hero-image-dark.png"
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
                                    <strong className="text-foreground">KAIST Dean&apos;s List Honors</strong> (2025 Spring &amp; Fall)
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

                        <section className="space-y-4">
                            <h2 className="text-subsection-h2 border-b pb-2">Research Experience</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold">Algorithmic Intelligence Lab (ALIN Lab) @ KAIST</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Advisor: Prof. Jinwoo Shin</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong className="text-foreground">Topic:</strong> On policy self-distillation for GUI Agent</li>
                                        <li><strong className="text-foreground">Details:</strong> TBD</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold">Big Data Analytics and Learning Lab (BigDyL Lab) @ KAIST</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Advisor: Prof. Noseong Park</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong className="text-foreground">Topic:</strong> Sampler Acceleration for Diffusion Language Models.</li>
                                        <li><strong className="text-foreground">Details:</strong> Design efficient sampling algorithms for DLMs.</li>
                                    </ul>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold">Brain x Machine Intelligence Lab (BMI Lab) @ KAIST</h3>
                                    <p className="text-sm text-muted-foreground mb-2">Advisor: Prof. Sang Wan Lee</p>
                                    <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                        <li><strong className="text-foreground">Topic:</strong> Decoding Cognitive States via Deep Neural Experimenter.</li>
                                        <li><strong className="text-foreground">Details:</strong> Visualized attention maps to analyze subject&rsquo;s cognitive decoding process. Studied the dynamics of cognitive states under One-shot and Incremental learning conditions.</li>
                                    </ul>
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
