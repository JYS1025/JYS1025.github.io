# Project Specification: JYS Blog

## Overview
A personal portfolio and blog website built with Next.js, designed to showcase research, projects, and thoughts. It features a static markdown-based blog system and dynamic GitHub project integration.

## Tech Stack
-   **Framework**: Next.js 14+ (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, shadcn/ui, Lucide React
-   **Animation**: Framer Motion
-   **Search**: Fuse.js (Client-side fuzzy search)
-   **Deployment**: GitHub Pages (Static Export)

## Key Features

### 1. Blog System
-   **Markdown Rendering**: Supports GFM, LaTeX (KaTeX), and Syntax Highlighting.
-   **Custom Components**: Enhanced styling for callouts (`aside`), images, and lists.
-   **File Management**: Robust slug handling with Unicode normalization (NFC) and caching for O(1) lookups.

### 2. Project Portfolio
-   **GitHub Integration**: Fetches repositories via GitHub API.
-   **Filtering**: Displays top projects with descriptions and links.

### 3. Search Functionality
-   **Global Search**: `Cmd+K` command palette interface.
-   **Lazy Loading**: Search logic (`fuse.js`) is loaded on-demand to optimize initial bundle size.
-   **Unified Navigation**: Mouse and keyboard support for seamless navigation.

### 4. UI/UX
-   **Responsive Design**: Mobile-friendly layout with a collapsible navigation menu.
-   **Theme**: System-aware Dark/Light mode toggle.
-   **Performance**: Optimized font loading (`next/font`) and asset handling.

## Directory Structure
-   `app/`: App Router pages and layouts.
-   `components/`: Reusable UI components and sections.
-   `lib/`: Utility functions (GitHub API, Post processing).
-   `posts/`: Markdown content files.
-   `public/`: Static assets and generated search index.
-   `scripts/`: Build-time scripts (e.g., search index generation).
