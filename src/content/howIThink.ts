/**
 * "How I think" — seven verbs (BRIEF §11).
 *
 * Every entry pairs a philosophical idea with an engineering practice, because the claim
 * the section is making is that they are the same habit wearing different clothes. The
 * pairing has to be exact or the section reads as decoration.
 */

export interface Habit {
  id: string;
  /** One word, imperative. */
  verb: string;
  /** One line, shown with the verb. */
  line: string;
  /** The philosophical half. */
  philosophy: string;
  /** The engineering half. It must answer the philosophical one, not merely follow it. */
  engineering: string;
  /**
   * Optional, and mostly absent. The verb, its line and the pair say it; a paragraph
   * under each one turned the section into an essay you had to read rather than a list
   * you could take in. Only CREATE still carries one.
   */
  body?: string;
}

export const howIThink: readonly Habit[] = [
  {
    id: "build",
    verb: "Build",
    line: "An idea that stays an idea is indistinguishable from one that was wrong.",
    philosophy: "An untested idea is a belief.",
    engineering: "Ship it and let it disagree with you.",
  },
  {
    id: "question",
    verb: "Question",
    line: "Convention is a cached answer. Sometimes the cache is stale.",
    philosophy: "Whose decision am I repeating?",
    engineering: "Read the source before trusting the docs.",
  },
  {
    id: "observe",
    verb: "Observe",
    line: "Debugging is mostly looking. So is the other thing.",
    philosophy: "Watching a reaction is not the same as being it.",
    engineering: "Read the logs before you read the code.",
  },
  {
    id: "learn",
    verb: "Learn",
    line: "Every project changes what the problem was.",
    philosophy: "The better question is the output, not the answer.",
    engineering: "The second implementation knows what it is building.",
  },
  {
    id: "simplify",
    verb: "Simplify",
    line: "Good engineering is mostly subtraction.",
    philosophy: "What is essential?",
    engineering: "What can be deleted?",
  },
  {
    id: "accept",
    verb: "Accept",
    line: "Some of it is not up to you. Rather a lot of it, actually.",
    philosophy: "Sort the world into what depends on you and what does not.",
    engineering: "Set a timeout, handle the failure, move on.",
  },
  {
    id: "create",
    verb: "Create",
    line: "Eventually thought has to become something.",
    philosophy: "Thought that never lands was entertainment.",
    engineering: "Close the loop. Write it, ship it, sing it.",
    body: "Reading, thinking and arguing are all enjoyable enough to become a substitute for the work. At some point the loop has to close, or you have merely been entertained by your own mind.",
  },
];

/**
 * The dichotomy of control, which lives inside ACCEPT. The wording of the "in your
 * control" list is Ujjawal's own from BRIEF §10; the citation is verified in
 * docs/SOURCES.md and must travel with the quotation.
 */
export const control = {
  habitId: "accept",
  yours: {
    label: "Up to you",
    items: [
      "How you think",
      "How you design",
      "How you debug",
      "How you respond to failure",
      "Whether you keep learning",
    ],
  },
  theirs: {
    label: "Not up to you",
    items: [
      "The network",
      "The vendor's status page",
      "The free tier that sleeps",
      "The deadline",
      "Whether anyone replies",
    ],
  },
} as const;
