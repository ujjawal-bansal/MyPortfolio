/**
 * Copy for the hidden things (BRIEF §14, §15, §32).
 *
 * Rules these all follow: none blocks anything, none is announced, each is reachable by
 * keyboard, and each is silent by default. A reward for curiosity stops being one the
 * moment it demands attention.
 */

/** Shown when Neti Neti has removed everything. The whole point of the interaction. */
export const netiNetiQuestion = "What remains when everything else is removed?";

export const netiNetiSteps: readonly string[] = [
  "Removing the work.",
  "Removing the words.",
  "Removing the field.",
  "Removing the interface.",
];

/**
 * For anyone who opens DevTools. Plain `%c` styling only — no ASCII art, and nothing
 * that pretends to be an error.
 */
export const consoleNote = {
  heading: "You opened the console.",
  lines: [
    "Which is its own kind of answer to the question this site keeps asking.",
    "",
    "Press ⌘K / Ctrl+K anywhere. Then type `help`, or don't.",
    "",
    "Built with Next.js, canvas 2D and rather too much reading.",
  ],
};
