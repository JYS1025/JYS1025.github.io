# Personal Portfolio Blog

A personal portfolio and blog platform built with Next.js.

Live Site: https://jys1025.github.io/

> **Technical Specification**
>
> For detailed information about the project architecture, tech stack, key features, and troubleshooting, please refer to [PROJECT_SPEC.md](./PROJECT_SPEC.md).

## Quick Start

### Installation and Run

```bash
# 1. Clone repository
git clone https://github.com/JYS1025/JYS1025.github.io.git
cd JYS1025.github.io

# 2. Install dependencies
npm install

# 3. Run development server
npm run dev
```

### How to Add Blog Posts

1.  Create a new `.md` file in the `posts/` directory.
2.  Add the following Frontmatter at the top of the file.

```yaml
---
title: "Post Title"
date: "2024-01-01"
description: "Post Summary"
topics: ["Topic1", "Topic2"]
---
```

3.  Push to the `main` branch to automatically deploy via GitHub Actions.
