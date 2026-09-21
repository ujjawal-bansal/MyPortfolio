import { Instrument_Sans, JetBrains_Mono, Newsreader, Tiro_Devanagari_Sanskrit } from "next/font/google";

/**
 * Serif — philosophy, quotes, major conceptual statements.
 * Variable across weight and optical size, so one file covers 14px body italics
 * and a 120px hero line without either looking wrong.
 */
export const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal"],
  // No `opsz` axis. A two-axis variable font is a much larger file, and on a throttled
  // mobile connection the preloaded serif was measurably delaying first paint. The
  // optical-size refinement is not worth ~100kb on the critical path.
});

/**
 * Serif italic — a separate instance purely so it is not preloaded.
 *
 * Loading it as a second `style` on the roman above put a 62kb file on the critical path
 * of every page: `next/font` preloads a family, not a style, and nothing above the fold
 * is italic. The first italic on the page is in Self, well below the fold.
 *
 * It has to be its own family because Tailwind's `italic` only sets `font-style`; with
 * one family the browser would synthesise an oblique from the roman, which on a display
 * serif at 32px is visibly wrong. Use the `font-serif-italic` utility, not `font-serif`,
 * wherever serif italic is wanted.
 */
export const serifItalic = Newsreader({
  variable: "--font-newsreader-italic",
  subsets: ["latin"],
  display: "swap",
  style: ["italic"],
  preload: false,
});

/**
 * Sans — navigation, UI, body copy. Variable weight, one file.
 *
 * Not preloaded: above the fold the hero is serif and mono, so the sans is not on the
 * critical path. next/font's metric-matched fallback means the swap costs no layout
 * shift (verified: CLS 0).
 */
export const sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

/** Mono — code, terminal, technical metadata. Variable weight, one file. */
export const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Devanagari — Sanskrit verses only. Cut for Sanskrit typesetting, so conjuncts
 * and vowel marks render correctly rather than approximately.
 * Static 400 only, and not preloaded: it serves a handful of lines, far below the fold.
 */
export const devanagari = Tiro_Devanagari_Sanskrit({
  variable: "--font-tiro-devanagari",
  subsets: ["devanagari"],
  display: "swap",
  weight: "400",
  preload: false,
});

// Raw next/font variables are named after the typeface; globals.css maps them
// onto the semantic --font-serif / --font-sans / --font-mono / --font-devanagari.
export const fontVariables = [
  serif.variable,
  serifItalic.variable,
  sans.variable,
  mono.variable,
  devanagari.variable,
].join(" ");
