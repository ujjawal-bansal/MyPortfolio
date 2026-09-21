/**
 * The loading screen's words.
 *
 * Verified in docs/SOURCES.md. `atha` is the particle a Sanskrit treatise opens with, the
 * mark that the thing you came for starts here; `ārabhyate` is "it is begun". Written as
 * two words, without sandhi, by choice: joined they would read athārabhyate, and apart
 * each word stays legible on its own, which is the point of a first screen.
 *
 * Unlike `atha` alone, this is not a formula any text opens with — it is a sentence,
 * grammatically sound, composed for this page. That is why it carries no attribution and
 * no translation on screen: it is offered as a beginning, never as a quotation.
 */
export const enterWord = {
  devanagari: "अथ आरभ्यते",
  /** Not rendered. It documents the Devanagari beside it. */
  iast: "atha ārabhyate",
  /**
   * Not rendered either, and deliberately: the word is shown untranslated. A gloss under
   * it would turn a beginning into a lesson. Kept here so nobody has to look it up.
   */
  gloss: "now, it is begun",
} as const;
