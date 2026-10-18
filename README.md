# karthiksukumaran.com

Personal blog and profile, built with Jekyll and hosted on GitHub Pages.

- `/` — blog home (Microservices Patterns Field Guide)
- `/blog/<slug>/` — individual posts
- `/profile/` — résumé / profile page (plain HTML in `profile/index.html`)

## Adding a new category (topic)

Create one file in `_blog_categories/`, e.g. `_blog_categories/genai-architecture.md`:

```yaml
---
title: GenAI Architecture        # posts use this exact text as their category
color: "#14b8a6"                 # accent colour for the section and cards
order: 0                         # position on the home page (lower = higher up)
description: One line describing the category.
# group: Optional label shown above the title
# order_by: pattern              # only for numbered series; default is newest first
---
```

Its page is generated at `/category/genai-architecture/`. The home page shows a section
for every category that has at least one post (latest 6 posts + "View all").

## Writing a post

Add a Markdown file to `_posts/` named `YYYY-MM-DD-slug.md`:

```yaml
---
title: "Full post title"
category: GenAI Architecture     # must match a category title
description: One-sentence summary shown under the title and on cards.
date: 2026-10-20 10:00:00 +0530
# Optional:
# short: Shorter title for cards
# summary: "What it does" line (shown in a box at the top)
# tools: [Tool A, Tool B]
---
```

The microservices pattern posts live in `_posts/microservices-patterns/` and are a
numbered series (`pattern_no`).

- Diagrams: use a fenced ` ```mermaid ` block.
- Avoid `{{` and `{%` in posts — Jekyll treats them as template tags.
- Link to other posts as `/blog/<slug>/`.

Push to `main` and GitHub Pages builds the site automatically.

## Run locally

Build exactly like GitHub Pages (needs Docker):

```
./build.sh
python -m http.server 8000 --directory _site
```

Then open http://localhost:8000.
