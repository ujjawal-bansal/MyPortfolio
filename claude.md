# Ujjawal's Portfolio — standing rules

## Project
Personal portfolio: "Code × Philosophy × Consciousness". Full creative brief in docs/BRIEF.md.
Read ONLY the BRIEF sections the current phase names. Do not read the whole brief every time.
Facts: docs/FACTS.md is the source of truth. It overrides BRIEF.md. Never invent achievements, URLs, quotes, or books.
Progress: docs/PROGRESS.md. Read it at the start of every session.

## Stack
Next.js (latest stable, App Router) + TypeScript + Tailwind CSS.
3D: three + @react-three/fiber + @react-three/drei, always via next/dynamic with ssr:false.
Motion: GSAP (+ScrollTrigger) and/or motion; smooth scroll: lenis.
Fonts via next/font only.

## Installing things
- You MAY install any npm package yourself. Prefer well-maintained packages; say in one line why you added it.
- If something needs to be installed OUTSIDE npm (system tool, account, API key), STOP and tell me first. Don't work around it.
- Never use sudo. Never run rm -rf. Never push to git without asking.

## Design rules
- Palette: near-black/charcoal base, parchment/ivory text, muted amber accent, occasional forest green & muted blue. Define as CSS variables.
- Type: serif for philosophy/big statements, sans for UI, mono for code/terminal, a proper Devanagari font for Sanskrit.
- Motif: THE DOT (one point → field → network → system → project → back to one point).
- Philosophy is subtle. Never a quote collection. Never religious imagery or "ancient wisdom" clichés.
- Every animation must respect prefers-reduced-motion. WebGL must have a static fallback. Mobile gets a simplified 3D scene, not none.

## Accuracy rules (non-negotiable)
- Sanskrit/transliteration/translation/source ONLY from docs/SOURCES.md (built in Phase 1). Don't add new verses without verifying and adding them there.
- Multiple interpretations → say "one reading is…", never present as absolute truth.
- No Osho or Shankaracharya quotation unless it's in SOURCES.md with a verified source.

## Working style
- Content lives in src/content/*.ts (data), components render it. No hard-coded copy inside components.
- Reusable components, semantic HTML, keyboard accessible.
- End of every phase: run `npm run build` (must pass), update docs/PROGRESS.md, `git add -A && git commit`, then STOP and give me a short summary + anything I need to do.