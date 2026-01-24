export interface BlogPost {
    title: string
    description: string
    date: string
    slug: string
    topics: string[]
}

export const posts: BlogPost[] = [
    {
        title: "The Future of Generative AI in Science",
        description: "How large language models are transforming scientific discovery.",
        date: "October 15, 2023",
        slug: "future-of-generative-ai",
        topics: ["Deep Learning and Generative Model", "Essay"],
    },
    {
        title: "Understanding Diffusion Models",
        description: "A deep dive into the mathematics behind stable diffusion.",
        date: "September 28, 2023",
        slug: "understanding-diffusion-models",
        topics: ["Deep Learning and Generative Model"],
    },
    {
        title: "My Internship Experience at Google DeepMind",
        description: "Reflections on a summer spent working with world-class researchers.",
        date: "August 10, 2023",
        slug: "deepmind-internship",
        topics: ["Essay"],
    },
    {
        title: "왜 나는 너를 사랑하는가",
        description: "A philosophical exploration of love, idealism, and romantic realism through Alain de Botton's debut novel.",
        date: "January 15, 2024",
        slug: "why-i-love-you-alain-de-botton",
        topics: ["Book Review", "Essay"],
    },
]

export const topics = [
    { name: "Deep Learning and Generative Model", slug: "deep-learning" },
    { name: "Brain and Cognitive Science", slug: "brain-science" },
    { name: "Book Review", slug: "book-review" },
    { name: "Essay", slug: "essay" },
]
