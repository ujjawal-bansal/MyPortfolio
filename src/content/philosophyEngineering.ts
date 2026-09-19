/**
 * "Why does a developer read philosophy?" (BRIEF §12).
 *
 * The section is a mirror: the same question asked twice, once in the vocabulary of
 * philosophy and once in the vocabulary of engineering, with a rule down the middle.
 */

export interface Pairing {
  id: string;
  title: string;
  /** What philosophy asks. */
  philosophy: string;
  /** What engineering asks. The mirror image, not a loose rhyme. */
  engineering: string;
  /** The line that does the work. Kept short enough to be remembered. */
  pivot: string;
  /** Two or three sentences closing the gap. */
  body: string;
  /** Points at a verse or citation in docs/SOURCES.md. */
  sourceId?: string;
}

export const question = "Why does a developer read philosophy?";

export const answer =
  "Because both jobs are the same activity: finding the assumption underneath the thing everyone agrees on, and checking whether it holds.";

export const pairings: readonly Pairing[] = [
  {
    id: "abstraction",
    title: "Abstraction",
    philosophy: "What is essential?",
    engineering: "What can we remove?",
    pivot: "An abstraction that keeps everything is a copy.",
    body: "Two ways of asking which properties survive when you stop looking at the particular case. Keep too much and you have duplicated the thing; drop the wrong part and it leaks. Choosing correctly is a judgement about essence, whatever we call it in the standup.",
  },
  {
    id: "systems",
    title: "Systems",
    philosophy: "How do concepts depend on each other?",
    engineering: "How do components depend on each other?",
    pivot: "The content is in the edges, not the nodes.",
    body: "You can understand every service in a system and still not understand the system, for the same reason you can define every term in an argument and still miss what it commits you to. Both disciplines spend most of their time on the arrows.",
  },
  {
    id: "debugging",
    title: "Debugging",
    philosophy: "Which of my beliefs is doing the damage?",
    engineering: "Which of my assumptions is false?",
    pivot: "A bug is an assumption made visible.",
    body: "The program has been telling the truth the whole time; the surprise is entirely on your side. Philosophy does the same trick more slowly and with worse tooling. Both go faster once you accept that the thing you are most certain about is the most promising suspect.",
    sourceId: "neti-neti",
  },
  {
    id: "identity",
    title: "Identity",
    philosophy: "What makes a person the same person over time?",
    engineering: "What makes this the same record after every field has changed?",
    pivot: "Theseus's ship, with a foreign key constraint.",
    body: "Software has state; people have memory; both are rewritten continuously and both insist on continuity anyway. A primary key is a decision about what would have to change before this stopped being the same thing — which is the oldest question in the subject, answered in DDL.",
  },
  {
    id: "control",
    title: "Control",
    philosophy: "What is actually up to me?",
    engineering: "What is inside the boundary of this system?",
    pivot: "You cannot stop a token being stolen. You can make using it announce itself.",
    body: "Epictetus opens the Enchiridion by dividing the world in two, and it is the one Stoic move that survives translation into software without embarrassment. The network is not up to you. Your retry policy, your timeouts and your behaviour at 3am are.",
    sourceId: "stoic",
  },
  {
    id: "observation",
    title: "Observation",
    philosophy: "Can the observer be observed?",
    engineering: "What is watching the thing that watches?",
    pivot: "The alerting pipeline fails as silently as the service it watches.",
    body: "Vedanta calls the witness sākṣin and points out that you can never get behind it — whatever you observe is, by that fact, not the observer. Monitoring inherits the same regress, minus the serenity, and something still has to notice.",
    sourceId: "sakshi",
  },
];
