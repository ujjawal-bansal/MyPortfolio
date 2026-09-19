/**
 * The palette, as literal values.
 *
 * ⚠️ This file mirrors the `:root` block in `src/app/globals.css`. It exists because two
 * consumers cannot read CSS custom properties at all:
 *
 * - **shiki** themes are TextMate JSON — resolved at build time, no CSS in scope.
 * - **Satori** (next/og) renders Open Graph images without a stylesheet.
 *
 * Before this file existed the same hex values were copy-pasted into three places, and a
 * contrast fix to globals.css silently left the code blocks and social cards on the old,
 * failing values. **Change a colour here and in globals.css together.**
 */
export const palette = {
  void: "#07070a",
  ink: "#0b0b0e",
  charcoal: "#131317",

  ivory: "#f5f1e6",
  parchment: "#e6dfcd",
  parchmentDim: "#b4ac9a",
  /** 6.32:1 on ink, 5.96:1 on charcoal. WCAG AA for normal text. */
  parchmentFaint: "#9a9183",
  /** 4.81:1 on ink, 4.54:1 on charcoal. WCAG AA for normal text. */
  parchmentGhost: "#847d6e",

  amber: "#c98f43",
  amberBright: "#e3ac63",
  amberDeep: "#8c5f28",

  forest: "#4a6b55",
  forestBright: "#7ba488",
  blueBright: "#85a8c6",
  brown: "#7a6049",
} as const;
