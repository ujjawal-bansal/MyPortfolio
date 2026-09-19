import {
  Caveat,
  Instrument_Sans,
  JetBrains_Mono,
  Newsreader,
  Tiro_Devanagari_Sanskrit,
} from "next/font/google";

/**
 * Serif — philosophy, quotes, major conceptual statements.
 * Variable across weight and optical size, so one file covers 14px body italics
 * and a 120px hero line without either looking wrong.
 */
export const serif = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

/** Sans — navigation, UI, body copy. Variable weight, one file. */
export const sans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  display: "swap",
});

/** Mono — code, terminal, technical metadata. Variable weight, one file. */
export const mono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Hand — the note fragments in "When I'm not writing code", nothing else.
 * Latin only, not preloaded: it serves a handful of words far below the fold, and a
 * script face anywhere near the UI would undo five phases of restraint.
 */
export const hand = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
  preload: false,
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
  sans.variable,
  mono.variable,
  devanagari.variable,
  hand.variable,
].join(" ");
