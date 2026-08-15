# Portfolio + Blog — Requirements

add contact me / wanna be friends ( like a schedule coffee meet feature)
whats for lunch random generator

## 1. Goal
Personal portfolio site showcasing full-stack range with a clear split between
frontend and backend/data-engineering work, plus a blog. Deployed on
Cloudflare Pages.

## 2. Tech Stack
- **Build tool:** Vite
- **Framework:** React + TypeScript (no meta-framework — no Next.js/Astro)
- **Styling:** Tailwind CSS
- **Content/CMS:** none for v1 — blog posts are Markdown/MDX files
  committed directly to the repo (`/content/posts/`), authored in-editor.
  A CMS admin UI (likely backed by a separate service) may be added later;
  out of scope for this build — see Section 8.
- **Routing:** React Router (client-side), with a static prerender step if
  SEO on blog posts matters (see open questions)
- **Hosting/Deploy:** Cloudflare Pages, connected to GitHub repo for CI
  auto-deploy on push to `main`

## 3. Design Direction

Reference: aakashrajbanshi.com.np — Notion-style, minimal color, block-based
layout.

**Color** (near-monochrome, one muted accent used sparingly — for links,
tags, and hover states only, never as a background fill):
- `--bg`: `#FFFFFF`
- `--bg-subtle`: `#F7F6F3` (Notion-style off-white for cards/blocks)
- `--text`: `#191919`
- `--text-muted`: `#787774`
- `--border`: `#E9E9E7`
- `--accent`: `#2F6FED` (muted slate blue — links, tags, active states)

**Type**
- Body/UI: a clean humanist sans (e.g. Inter or system-ui stack)
- Headings: same family, weight-differentiated rather than a separate
  display face — Notion-style pages lean on size/weight/spacing, not font
  pairing, to keep things quiet
- Monospace (for code snippets/tags): a standard mono stack

**Layout**
- Centered content column, max-width ~720–800px, generous vertical
  whitespace between blocks (this is the core "Notion" feel — content reads
  as stacked blocks, not sections with heavy visual dividers)
- Each content block (project entry, blog post preview, about section) gets
  a small leading icon/emoji instead of a photo or illustration — e.g. 🗂
  for Projects, ✍️ for Blog, 👤 for About — consistent with Notion's use of
  page-icon-as-visual-anchor
  ASCII sketch:
  ```
  🏠  Name
      One-line positioning statement

  🗂  Projects
      — Backend / Data
        [ project block ]
        [ project block ]
      — Full-Stack
        [ project block ]

  ✍️  Blog
      [ post row — title · date · tags ]
      [ post row — title · date · tags ]
  ```
- No hero image, no gradients, no card shadows — flat blocks separated by
  hairline borders (`--border`) or whitespace only
- Tags render as small pill badges: `--bg-subtle` fill, `--text-muted` text,
  1px `--border` outline

**Signature element:** a left-side, collapsible page-tree sidebar (mirrors
Notion's own navigation pattern) listing Home / Projects / Blog / About,
persistent on desktop, collapsed behind a menu icon on mobile.

**Explicitly avoid:** gradients, drop shadows, warm cream/terracotta
palettes, bright accent colors, decorative illustrations, numbered-step
markers unless content is a true sequence.

## 4. Site Structure

### Pages
- `/` — Landing/hero: name, one-line positioning statement, CTA to projects
  and blog
- `/projects` — Project grid, split into two clearly labeled sections:
  - **Backend / Data Engineering** — e.g. RBAC admin panel (Druid SQL
    parser + ClickHouse), Kafka pipeline work, LegalBot RAG backend,
    Baseball Stats API (Java Spring Boot)
  - **Full-Stack / Frontend** — e.g. React/TypeScript WebView work,
    Lifting-Log app, Baseball Play Whiteboard app
  - Each project card: title, 1–2 line summary, tech tags, links
    (GitHub / live demo if available)
- `/blog` — List of posts (title, date, excerpt, tags)
- `/blog/:slug` — Individual post page, rendered from Markdown/MDX
- `/about` — Background: final-year CS (Information Systems) at Universiti
  Malaya, internship at Infinity Data Tech, career direction (data
  engineering/backend), links to GitHub/resume

### Navigation
Persistent header nav: Home / Projects / Blog / About. Footer with GitHub
link and (optional) email/LinkedIn.

## 5. Content Model

**Blog posts** (`/content/posts/*.md`, hand-authored)
- `title` (string, required)
- `date` (datetime, required)
- `slug` (string, auto from filename)
- `tags` (list of strings)
- `excerpt` (text, short)
- `body` (markdown, required)
- `draft` (boolean, default false)

**Projects** — decide whether projects are also CMS-managed content or
hardcoded in a TS data file (`src/data/projects.ts`). Recommendation:
hardcode initially (fewer moving parts), migrate to CMS later if it grows.

## 6. Non-Functional Requirements
- Fast initial load — code-split blog/project routes, lazy-load images
- Responsive down to mobile widths
- Dark mode (nice-to-have, not blocking)
- Basic SEO: meta tags per page, Open Graph tags on blog posts, sitemap.xml,
  robots.txt
- RSS feed for blog (nice-to-have)
- Lighthouse score target: 90+ across categories

## 7. Deployment
- Cloudflare Pages, v1: manual/direct deploy (e.g. `wrangler pages deploy
  dist` or dashboard upload) — no CI/CD pipeline wired up yet
- Build command: `npm run build`; output directory: `dist`
- Default `*.pages.dev` URL (see Section 9)

## 8. Out of Scope (for v1)
- CI/CD pipeline (e.g. GitHub Actions auto-deploy on push) — deploys are
  manual for now, pipeline to be added later
- Any backend feature (unspecified for now — to be scoped later)
- CMS / admin UI for editing blog posts (will likely come with its own
  backend later — separate project)
- Comments on blog posts
- Newsletter/email capture
- Multi-language support
- Analytics (add later if wanted — e.g. Cloudflare Web Analytics, no cookies)

## 9. Decisions
1. **SEO on blog posts:** no prerendering for v1 — plain client-side
   rendering is acceptable; heavy SEO is not a priority for this site.
2. **Domain:** no custom domain yet — ship on the default
   `*.pages.dev` URL.
3. **Resume:** linked as a PDF download (static file in `/public`, e.g.
   `/resume.pdf`), not a dedicated `/resume` page.

## 10. Deliverable for Codex
Scaffold the Vite + React + TS + Tailwind project, wire up React Router,
build out the pages/components above (frontend only — content authored as
in-repo Markdown/MDX, no CMS integration, no prerendering), and get it
deployable to Cloudflare Pages via a manual/direct deploy (no CI/CD
pipeline) on the default `*.pages.dev` domain.