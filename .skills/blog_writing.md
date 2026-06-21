# JYS Blog Writing Skill & Guidelines

This document serves as the standard operating procedure (SOP) and skill instruction for any AI agent creating or modifying blog posts in this repository. Agents must follow these exact formatting rules to maintain consistency across the blog.

## 1. File Location & Naming Convention
- **Path**: All blog posts must be saved in the `/posts/` directory.
- **Filename**: Use lowercase letters and hyphens instead of spaces (slug format). 
  - *Example*: `art-of-loving-erich-fromm.md`
  - *Example*: `overcoming-the-planar-bottleneck.md`

## 2. Front Matter (YAML)
Every markdown file must start with the following front matter block:
```yaml
---
title: "Exact Title of the Post"
date: "YYYY-MM-DD"
description: "A brief summary or compelling introduction (1-2 sentences)."
topics: ["Topic1", "Topic2"]
---
```
- Ensure the `date` is formatted strictly as `YYYY-MM-DD` (e.g. `2026-06-21`).
- `topics` must be an array of strings.

## 3. General Post Structure
For standard essays or book reviews:
- The content immediately following the front matter should begin with an `H1` heading (`# Title`) matching the front matter title.
- Keep paragraphs readable and use proper markdown lists or quotes where appropriate.

## 4. Paper Review / Translation Post Structure
When translating or migrating academic papers (e.g., from LaTeX to Markdown):
1. **PDF Link**: The very first line after the front matter MUST be the PDF link in this exact format:
   ```markdown
   **[📄 Read the Full Paper (PDF)](<link>)**
   ```
2. **Authors**: Below the link, list the authors in bold:
   ```markdown
   **Author 1, Author 2**
   
   Affiliation / Contacts
   ```
3. **Headings**: Use standard markdown headings (`## Abstract`, `## Introduction`, etc.) instead of an `H1` for the title.
4. **Math/Equations**:
   - Use `$$...$$` for block equations.
   - Use `$...$` for inline equations.
   - Do NOT use standard LaTeX environments like `\begin{equation}` unless properly formatted/supported by the KaTeX plugin.

## 5. Image & Resource Management
- **Directory**: Create a dedicated directory for the post's images at `/public/images/posts/<post-slug>/`.
- **References**: Reference the images in the markdown using the absolute path from the public folder:
  ```markdown
  ![](/images/posts/<post-slug>/image.png)
  ```
- **Image Grids**: When a grid layout (e.g., 3x3) is requested or exists in the original paper, use an HTML `<table>` without borders for robust rendering across different markdown parsers:
  ```html
  <table style="border: none; width: 100%;">
    <tr>
      <td style="border: none;"><img src="/images/posts/<slug>/1.png" alt="1" /></td>
      <td style="border: none;"><img src="/images/posts/<slug>/2.png" alt="2" /></td>
      <td style="border: none;"><img src="/images/posts/<slug>/3.png" alt="3" /></td>
    </tr>
  </table>
  ```

## 6. Confidentiality Handling
If a user explicitly states a post/paper is "대외비" (confidential):
- Append the markdown file path and the image directory path to the end of the `.gitignore` file so it is not tracked by Git.
  ```gitignore
  # confidential post
  /posts/<post-slug>.md
  /public/images/posts/<post-slug>/
  ```
- Do not remove them from `.gitignore` unless explicitly requested by the user when the embargo is lifted.

## 7. Clean-Up
- After migrating content from an external folder or source directory within the repository, confirm with the user and delete the original source directory and its raw files to keep the workspace clean.
