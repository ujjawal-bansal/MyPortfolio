/**
 * Floating fragments drifting behind the hero — thought before it is organised.
 *
 * Sparse on purpose. The temptation is a snowstorm of symbols; the brief asks for
 * something closer to dust. Twelve is enough to read as "there is thinking happening"
 * without becoming a screensaver.
 *
 * The Devanagari entries are single letterforms and syllables, not quotations. They are
 * drawn from the verses verified in docs/SOURCES.md, so nothing here asserts a meaning
 * or needs a citation — they are shapes, the way `=>` is a shape.
 */

export type FragmentKind = "code" | "math" | "devanagari";

export interface Fragment {
  text: string;
  kind: FragmentKind;
  /** Position as a percentage of the hero box. Hand-placed to stay clear of the copy. */
  x: number;
  y: number;
  /** Relative size. 1 is the base. */
  scale: number;
  /** Seconds. Varied so they never fall into step with each other. */
  duration: number;
  delay: number;
}

export const fragments: readonly Fragment[] = [
  { text: "const", kind: "code", x: 8, y: 16, scale: 0.9, duration: 23, delay: 0 },
  { text: "=>", kind: "code", x: 84, y: 24, scale: 1.1, duration: 19, delay: -6 },
  { text: "return", kind: "code", x: 72, y: 78, scale: 0.85, duration: 27, delay: -11 },
  { text: "null", kind: "code", x: 16, y: 72, scale: 0.95, duration: 21, delay: -3 },
  { text: "async", kind: "code", x: 91, y: 58, scale: 0.8, duration: 25, delay: -17 },

  { text: "∴", kind: "math", x: 27, y: 30, scale: 1.3, duration: 29, delay: -8 },
  { text: "∀", kind: "math", x: 63, y: 13, scale: 1.2, duration: 22, delay: -14 },
  { text: "¬", kind: "math", x: 45, y: 85, scale: 1.25, duration: 26, delay: -2 },
  { text: "≡", kind: "math", x: 88, y: 41, scale: 1.1, duration: 24, delay: -19 },

  { text: "अ", kind: "devanagari", x: 20, y: 46, scale: 1.4, duration: 31, delay: -5 },
  { text: "ब्र", kind: "devanagari", x: 79, y: 68, scale: 1.3, duration: 28, delay: -22 },
  { text: "न", kind: "devanagari", x: 57, y: 92, scale: 1.2, duration: 33, delay: -9 },
];

/** The word the particles assemble into at the "idea" stage. */
export const particleWord = "UJJAWAL BANSAL";
