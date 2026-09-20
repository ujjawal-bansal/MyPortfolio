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

| Path                       | What lives there                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `src/content/*.ts`         | Every string on the site, typed                                                                  |
| `src/components/sections/` | One component per section of the page                                                            |
| `src/components/ui/`       | Shared pieces: `Section`, `DotNav`, `ThemeToggle`, links                                         |
| `src/lib/dot-scene/`       | The Canvas 2D particle engine                                                                    |
| `src/app/`                 | Routes, OG image generation, sitemap, robots                                                     |
| `docs/`                    | `facts.md` (source of truth), `SOURCES.md` (every Sanskrit citation), `DEPLOY.md`, `PROGRESS.md` |

Two rules the content follows:

- **`docs/facts.md` is authoritative.** Nothing about the projects, the timeline or the
  stack is written from memory; where it disagrees with anything else, it wins.
- **Sanskrit only from `docs/SOURCES.md`**, where each line carries its text, translation,
  source and the readings that disagree with each other.

## Accessibility and motion

Every animation is behind `prefers-reduced-motion`. The canvas has a static fallback.
Text colours were measured against their backgrounds rather than eyeballed; the weakest
passes AA. Both themes ship: dark by default, light behind an explicit toggle.

## Deploying

See [`docs/DEPLOY.md`](docs/DEPLOY.md).
