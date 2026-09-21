/**
 * "When I'm not writing code" (BRIEF §23). Intended to feel intimate rather than
 * impressive — the section where the site stops making a case.
 *
 * Reading, philosophy, singing and music are all from Ujjawal's own brief (§1, §23);
 * facts.md does not record them, so nothing here claims an achievement, a performance,
 * or a recording. It says what he does, not how well.
 */

export interface Pursuit {
  id: string;
  label: string;
  /** One or two sentences. First person. No CV verbs. */
  body: string;
}

export const pursuits: readonly Pursuit[] = [
  {
    id: "reading",
    label: "Reading",
    body: "Mostly philosophy, and mostly slowly. I re-read more than I read; a book I have finished once I have usually only located.",
  },
  {
    id: "philosophy",
    label: "Thinking about it afterwards",
    body: "The reading is the easy half. The part that takes the time is noticing, a week later, that something I believed has quietly stopped fitting.",
  },
  {
    id: "singing",
    label: "Singing",
    body: "Badly at first, which was the useful part. It is the one thing I do where there is no way to be clever about the gap between what I meant and what came out.",
  },
  {
    id: "music",
    label: "Listening",
    body: "Usually while writing something. Music is the only background process I allow myself during work that needs attention, which probably says something.",
  },
];

/**
 * Heights, 0–1, of the drawn waveform. Hand-shaped, not random.
 *
 * This used to be the whole of the waveform at the foot of the section, standing in for
 * music in general. The strip is now built from real listening (see `content/soundtrack.ts`),
 * and these forty-two numbers are what renders when there is none to show — Spotify
 * unconfigured, unreachable, or a quiet week. It claims nothing, so it cannot be wrong,
 * which is what makes it the right thing to fall back to.
 */
export const waveform: readonly number[] = [
  0.12, 0.2, 0.34, 0.28, 0.46, 0.62, 0.5, 0.72, 0.9, 0.68, 0.84, 0.55, 0.64, 0.42, 0.56, 0.38, 0.48, 0.3, 0.4,
  0.24, 0.34, 0.18, 0.26, 0.14, 0.22, 0.3, 0.44, 0.36, 0.52, 0.66, 0.58, 0.74, 0.62, 0.46, 0.54, 0.32, 0.4,
  0.22, 0.28, 0.16, 0.2, 0.12,
];
