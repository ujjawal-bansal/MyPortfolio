# Ujjawal Bansal

Portfolio and writing. Code × Philosophy × Consciousness, built as one long scroll with
three case studies and an essay behind it.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis.
The particle scene is Canvas 2D, not WebGL. No database, no server runtime; all 16
routes are statically prerendered.

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build; must pass before committing
npm run lint
```

## How it is organised

Content is data, components render it. Nothing user-facing is hard-coded in a component.

| Path                       | What lives there                                         |
| -------------------------- | -------------------------------------------------------- |
| `src/content/*.ts`         | Every string on the site, typed                          |
| `src/components/sections/` | One component per section of the page                    |
| `src/components/ui/`       | Shared pieces: `Section`, `DotNav`, `ThemeToggle`, links |
| `src/lib/dot-scene/`       | The Canvas 2D particle engine                            |
| `src/app/`                 | Routes, OG image generation, sitemap, robots             |

Two rules the content follows:

- **Nothing is written from memory.** Every claim about the projects, the timeline and
  the stack is checked against a fact sheet kept alongside the repo; where that sheet
  disagrees with anything else, it wins.
- **Every Sanskrit line is cited.** Each one is recorded with its text, transliteration,
  translation, source, and the readings that disagree with each other, before it reaches
  a component. Nothing on the site is decorative Sanskrit.

## Accessibility and motion

Every animation is behind `prefers-reduced-motion`. The canvas has a static fallback.
Text colours were measured against their backgrounds rather than eyeballed; the weakest
passes AA. Both themes ship: dark by default, light behind an explicit toggle.

## Deploying

Vercel, with defaults. One optional environment variable, `NEXT_PUBLIC_SITE_URL`, sets
the canonical origin for `sitemap.xml`, the canonical tag and the Open Graph images; it
is baked at build time, so set it before the build you intend to serve. Without it the
site falls back to Vercel's own origin and stays correct.
