import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About | JYS Blog",
    description: "About me and my research interests.",
}

export default function AboutPage() {
    return (
        <div className="container mx-auto py-12 md:py-24 lg:py-32">
            <div className="mx-auto max-w-3xl space-y-12">
                <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">About Me</h1>
                    <p className="text-xl text-muted-foreground">
                        My goal is to understand the essence of intelligence through mathematical and biological lenses.
                    </p>
                </div>

                <div className="space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Research Interests</h2>
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
                        <h2 className="text-2xl font-bold border-b pb-2">Research Experience</h2>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold">Big Data Analytics and Learning (BigDyL) @ KAIST</h3>
                                <p className="text-sm text-muted-foreground mb-2">Advisor: Prof. Noseong Park</p>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    <li><strong className="text-foreground">Topic:</strong> Sampler Acceleration for Diffusion Language Models using Riemannian Geometry.</li>
                                    <li><strong className="text-foreground">Details:</strong> Investigated geometric structures of discrete data manifolds to design efficient sampling algorithms for DLMs.</li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold">Brain x Machine Intelligence Lab (BMI Lab) @ KAIST</h3>
                                <p className="text-sm text-muted-foreground mb-2">Advisor: Prof. Sang Wan Lee</p>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    <li><strong className="text-foreground">Topic:</strong> Decoding Cognitive States via Deep Neural Experimenter.</li>
                                    <li><strong className="text-foreground">Details:</strong> Visualized attention maps to analyze subject's cognitive decoding process. Studied the dynamics of cognitive states under One-shot and Incremental learning conditions.</li>
                                </ul>
                            </div>

                            <div className="pt-2">
                                <h3 className="text-lg font-semibold mb-2">Pre-University Research Projects</h3>
                                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                    <li>Mathematical modeling of epidemic spread (COVID-19).</li>
                                    <li>Analysis of viscous coefficients via floating body motion between fluids.</li>
                                    <li>Acoustic conversion analysis of periodic shockwaves.</li>
                                    <li>Design of dynamic protection mechanisms for falling objects.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Academic Highlights</h2>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li><strong className="text-foreground">AI & Data</strong>: Deep Learning, Machine Learning, Database Systems.</li>
                            <li><strong className="text-foreground">Systems & Theory</strong>: Operating Systems, Programming Languages, Probability & Statistics.</li>
                            <li><strong className="text-foreground">Neuroscience</strong>: Theoretical Neuroscience, Biology of Neurons, Statistics for Brain Science.</li>
                        </ul>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Tech Stack</h2>
                        <div className="flex flex-wrap gap-2">
                            {["Python", "C++", "Rust", "Scala", "PyTorch", "HuggingFace", "SQL", "LaTeX"].map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold border-b pb-2">Personal Preferences</h2>
                        <p className="text-muted-foreground">I find inspiration in classical literature and philosophical discourse.</p>
                        <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                            <li><strong className="text-foreground">Philosophy</strong>: Kant (<em>Critique of Pure Reason</em>), Nietzsche, Camus, Foucault.</li>
                            <li><strong className="text-foreground">Literature</strong>: <em>The Sorrows of Young Werther</em>, <em>The Stranger</em>, <em>Siddhartha</em>, <em>The Judgment</em>, <em>Status Anxiety</em>.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    )
}
