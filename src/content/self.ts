/**
 * The Self section (BRIEF §5). An About section that questions its own premise before
 * answering it — a quiet neti-neti, structurally rather than by saying so.
 *
 * The tone brief is explicit and worth repeating: intelligent, restrained, self-aware.
 * Not dramatic. The identities are struck through, not deleted with a flourish.
 */

export interface Identity {
  text: string;
  /** Shown beside the struck line on wide screens. Half a thought, not a footnote. */
  aside?: string;
}

/**
 * Each is true, and none of them survives being pressed on. The order runs outward:
 * label, matter, past, present, role, role, and finally the one doing the looking.
 */
export const identities: readonly Identity[] = [
  { text: "A name.", aside: "Chosen by other people, before I could object." },
  { text: "A body.", aside: "Replaced, more or less, every few years." },
  { text: "A collection of memories.", aside: "Edited on every recall." },
  { text: "A stream of thoughts.", aside: "None of which stay." },
  { text: "A programmer.", aside: "Only since 2023." },
  { text: "A student.", aside: "Ends in 2027." },
  { text: "An observer.", aside: "Closer. Still a noun." },
];

/** The turn. Deliberately a question, because the honest answer is not available. */
export const turn = "Or something beyond all of these?";

/**
 * And then the actual introduction, which is the point. Every claim here is in
 * docs/facts.md — apart from singing, which comes from Ujjawal's own brief (§1, §23).
 */
export const intro: readonly string[] = [
  "The boring answer is the useful one: a Computer Science student at ABES Engineering College in Ghaziabad, graduating in 2027, who writes software and cannot leave a question alone once it has been asked.",
  "The less boring answer is that those are not two things. I build systems that run in the real world: a queue running in a working eye clinic, an auth flow that assumes it will be attacked, a grading pipeline that refuses to guess. And I read philosophy for the same reason I debug: to find the assumption underneath the thing everyone already agrees on.",
  "I also sing, which has nothing to do with any of it, and everything to do with why I do not mind being bad at something for a while.",
];

/** Sits under the intro, small. The joke is that the section never answered its title. */
export const coda = "None of that answered the question. It rarely does.";
