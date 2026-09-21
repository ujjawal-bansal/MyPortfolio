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

Vercel, with defaults. Every environment variable below is optional: each one switches on
a part of the site, and the site is designed to be correct without any of them. Nothing
here is `NEXT_PUBLIC_` except the first, and nothing else may become so — the rest are
credentials, and are read only from server modules.

| Variable                                                              | What it turns on                                                                                                                                                                                 |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`                                                | The canonical origin for `sitemap.xml`, the canonical tag and the Open Graph images. **Baked at build time**, so set it before the build you intend to serve. Falls back to Vercel's own origin. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`                  | The all-time visitor count beside the theme toggle. Without them the circle renders nothing.                                                                                                     |
| `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN` | The listening trace at the foot of "When I'm not writing code". Without them the section shows its drawn waveform.                                                                               |

Paste the values bare. A `.env` file quotes them and Vercel does not strip quotes, so a
pasted `"https://…"` is a different string from the one that works — and the failure it
produces is a silent one, because both of these features are built to fail quietly rather
than break a page. Both log the reason to the Vercel runtime log instead.

### The Spotify grant

`SPOTIFY_REFRESH_TOKEN` is minted once, by hand, because it requires approving the app in
a browser:

```
node scripts/spotify-token.mjs
```

It needs the id and secret already set, and `http://127.0.0.1:8888/callback` registered as
a redirect URI on the app at [developer.spotify.com](https://developer.spotify.com/dashboard)
— the loopback IP, not `localhost`, which Spotify rejects for new apps.

The grant asks for `user-read-recently-played` and nothing else. That is deliberate and
load-bearing: the site is therefore **incapable** of reading what is playing right now,
rather than merely choosing not to. Widening the scope would quietly remove a guarantee
the section makes.

**The grant expires.** The app dashboard states a refresh token lifetime — 180 days — and
nothing in the codebase can renew it, because renewing it means a human approving the app
in a browser. Rotating the client secret invalidates it early, so rotate first and mint
second. When it lapses the section shows its drawn waveform and the runtime log says
`the refresh token is no longer valid`; re-running the script above is the whole fix.

The app stays in Development mode, which caps it at 25 authorised listeners. Only one
account is ever authorised — yours — so there is nothing to extend.
