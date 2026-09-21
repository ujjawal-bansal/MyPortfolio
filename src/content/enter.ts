/**
 * The loading screen's one word.
 *
 * Verified in docs/SOURCES.md. `atha` is the particle a Sanskrit treatise opens with:
 * not a claim about anything, just the mark that the thing you came for starts here.
 * A mahāvākya on a loading screen would be decoration; this is a beginning.
 */
export const enterWord = {
  devanagari: "अथ",
  /** Not rendered. It documents the Devanagari beside it. */
  iast: "atha",
  /**
   * Not rendered either, and deliberately: the word is shown untranslated. A gloss under
   * it would turn a beginning into a lesson. Kept here so nobody has to look it up.
   */
  gloss: "now; here, this begins",
} as const;
