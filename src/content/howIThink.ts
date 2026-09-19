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
  /** Two or three sentences. Restrained. No lesson at the end. */
  body: string;
  /** Where this actually shows up. Keeps the section from floating off. */
  inPractice?: string;
}

export const howIThink: readonly Habit[] = [
  {
    id: "build",
    verb: "Build",
    line: "An idea that stays an idea is indistinguishable from one that was wrong.",
    philosophy: "An untested idea is a belief.",
    engineering: "Ship it and let it disagree with you.",
    body: "I like the moment an idea stops being a conversation and becomes a thing with a URL. Mostly because that is when it starts telling you what you got wrong — an argument can be won, a deployment cannot.",
    inPractice:
      "QueueLite was interesting in the abstract for about a week. It became interesting in earnest the day a clinic started running on it.",
  },
  {
    id: "question",
    verb: "Question",
    line: "Convention is a cached answer. Sometimes the cache is stale.",
    philosophy: "Whose decision am I repeating?",
    engineering: "Read the source before trusting the docs.",
    body: "Most defaults are someone's old decision, made under constraints that may no longer exist. I am not against conventions — they are how anything gets done at speed — I just want to know which ones I hold because they are right and which because they came with the template.",
    inPractice:
      "Everyone reaches for WebSockets when they hear “live updates”. A clinic waiting room turned out to want polling, and saying so out loud took longer than implementing it.",
  },
  {
    id: "observe",
    verb: "Observe",
    line: "Debugging is mostly looking. So is the other thing.",
    philosophy: "Watching a reaction is not the same as being it.",
    engineering: "Read the logs before you read the code.",
    body: "The hard part of a bug is rarely the fix; it is noticing what is actually happening rather than what you assumed was happening. The discipline of watching something without immediately explaining it turns out to be the same discipline in both halves of my life, which I did not expect.",
    inPractice:
      "The duplicate token numbers looked like a race condition for a while. They were a date boundary. The evidence had been there the whole time, filed under the wrong theory.",
  },
  {
    id: "learn",
    verb: "Learn",
    line: "Every project changes what the problem was.",
    philosophy: "The better question is the output, not the answer.",
    engineering: "The second implementation knows what it is building.",
    body: "I have never finished something understanding it the way I did at the start. The useful output of a project is often not the project — it is the improved version of the question, which you only get by having answered the worse one.",
  },
  {
    id: "simplify",
    verb: "Simplify",
    line: "Good engineering is mostly subtraction.",
    philosophy: "What is essential?",
    engineering: "What can be deleted?",
    body: "Philosophy asks what is essential; engineering asks what can be removed. They are the same question asked by people with different deadlines. Most of my better decisions have been subtractions, and none of them felt clever at the time.",
    inPractice:
      "Four Groq call sites in Lexora, deliberately countable. Every piece of reasoning I moved out of the model made the system easier to trust.",
  },
  {
    id: "accept",
    verb: "Accept",
    line: "Some of it is not up to you. Rather a lot of it, actually.",
    philosophy: "Sort the world into what depends on you and what does not.",
    engineering: "Set a timeout, handle the failure, move on.",
    body: "The network, the vendor, the free tier that sleeps after fifteen minutes, the reviewer who will never reply. The Stoics were writing about exile and illness, but the shape of the idea survives the translation to software intact — and it is the one idea here that makes a bad week shorter.",
    inPractice: "Render's cold starts are not up to me. A cron job that keeps the service warm is.",
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
