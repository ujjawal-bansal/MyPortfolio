/**
 * The hero's background: four words, each written in two languages.
 *
 * These replace a scatter of tokens (`const`, `=>`, `async`, half-words like ब्र) that
 * looked technical and said nothing. Every pair here is a programming keyword and the
 * Sanskrit word that **means the same thing** — a translation, not a pun — so each one
 * explains itself by turning from one form into the other and back.
 *
 * Read in order they trace the path the whole site is built on: begin from the self,
 * stand back as its witness, subtract what you are not, arrive at the whole. That is
 * neti neti as a sequence, and the turns are staggered so the sequence plays in order.
 *
 * Every Sanskrit form is verified in docs/SOURCES.md ("The hero's background"). The
 * pairings are lexical on purpose: a drifting word has no room for a "one reading is…"
 * caveat, so nothing interpretively contested belongs here.
 */

export interface WordPair {
  /** The keyword, as it appears in real code. */
  code: string;
  devanagari: string;
  iast: string;
  /** What both forms mean. Documentation — the turning itself carries it on screen. */
  meaning: string;
  /** Desktop position as a percentage of the hero, placed in the empty space around the dot. */
  x: number;
  y: number;
  /** Phone position. The hero is text-dense on a phone, so these hold the top and bottom bands. */
  mx: number;
  my: number;
  /** Seconds into the 12s cycle at which this pair turns. Staggered 3s apart, in reading order. */
  delay: number;
  /** Seconds for one slow drift. Deliberately uneven so the pairs never fall into step. */
  drift: number;
}

export const wordPairs: readonly WordPair[] = [
  {
    code: "self",
    devanagari: "आत्मा",
    iast: "ātmā",
    meaning: "the self",
    x: 40,
    y: 15,
    mx: 10,
    my: 9,
    delay: 0,
    drift: 26,
  },
  {
    code: "observer",
    devanagari: "साक्षी",
    iast: "sākṣī",
    meaning: "the witness",
    x: 78,
    y: 28,
    mx: 52,
    my: 15,
    delay: 3,
    drift: 31,
  },
  {
    code: "not",
    devanagari: "नेति",
    iast: "neti",
    meaning: "not (thus)",
    x: 84,
    y: 62,
    mx: 12,
    my: 84,
    delay: 6,
    drift: 23,
  },
  {
    code: "all",
    devanagari: "सर्वम्",
    iast: "sarvam",
    meaning: "all, the whole",
    x: 58,
    y: 82,
    mx: 58,
    my: 90,
    delay: 9,
    drift: 29,
  },
];

/** The word the particles assemble into at the "idea" stage. */
export const particleWord = "UJJAWAL BANSAL";
