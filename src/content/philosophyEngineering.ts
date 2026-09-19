/**
 * "Why does a developer read philosophy?"
 *
 * The section pairs a philosophical question with an engineering one and lets the
 * reader notice they are the same question. The pairing has to be exact or it reads
 * as decoration — so each entry names a concrete engineering situation, not a mood.
 */

export interface Pairing {
  id: string;
  title: string;
  /** What philosophy asks. */
  philosophy: string;
  /** What engineering asks. */
  engineering: string;
  /** Two or three sentences closing the gap between them. */
  body: string;
  /** Optional: where this bites in real code. */
  concrete?: string;
  /** Optional citation, e.g. the Stoic line. Must exist in docs/SOURCES.md. */
  sourceId?: string;
}

export const question = "Why does a developer read philosophy?";

export const answer =
  "Because both jobs are mostly the same activity: finding the assumption underneath the thing everyone agrees on, and checking whether it holds.";

export const pairings: readonly Pairing[] = [
  {
    id: "abstraction",
    title: "Abstraction",
    philosophy: "What is essential?",
    engineering: "What can we remove?",
    body: "Two ways of asking which properties survive when you stop looking at the particular case. An abstraction that keeps everything is a copy; one that drops the wrong thing leaks. Choosing correctly is a judgement about essence, whatever we call it in the standup.",
    concrete:
      "A shared Zod schema is a bet about which parts of a transaction are the transaction. Get it wrong and every consumer inherits the mistake.",
  },
  {
    id: "systems",
    title: "Systems",
    philosophy: "How do concepts depend on each other?",
    engineering: "How do components depend on each other?",
    body: "In both cases the interesting content is in the edges rather than the nodes. You can understand every service in a system and still not understand the system, for the same reason you can define every term in an argument and still miss what it commits you to.",
    concrete:
      "Three surfaces reading one queue at three different refresh rates is not three problems. It is one problem about consistency, wearing three hats.",
  },
  {
    id: "debugging",
    title: "Debugging",
    philosophy: "Which of my beliefs is doing the damage?",
    engineering: "Which of my assumptions is false?",
    body: "A bug is an assumption made visible — the program has been telling the truth all along, and the surprise is entirely on your side. Philosophy does the same trick more slowly and with worse tooling. Both go faster once you accept that the thing you are most certain about is the most promising suspect.",
    concrete: "Neti neti is bisection. Not this, not this — until what is left has nowhere to hide.",
    sourceId: "neti-neti",
  },
  {
    id: "identity",
    title: "Identity",
    philosophy: "What makes a person the same person over time?",
    engineering: "What makes this the same record after every field has changed?",
    body: "Software has state; people have memory; both are continuously rewritten and both insist on continuity anyway. A primary key is a decision about what would have to change before this stopped being the same thing — which is Theseus's ship with a foreign key constraint.",
    concrete:
      "A refresh-token family is an identity claim: these tokens are the same session. Reuse detection is what happens when that claim turns out to be false.",
  },
  {
    id: "control",
    title: "Control",
    philosophy: "What is actually up to me?",
    engineering: "What is inside the boundary of this system?",
    body: "Epictetus opens the Enchiridion by dividing the world in two, and it is the one Stoic move that survives translation into software without embarrassment. The network is not up to you. The vendor's status page is not up to you. Your retry policy, your timeouts and your behaviour at 3am are.",
    concrete: "You cannot stop a token from being stolen. You can make using it announce itself.",
    sourceId: "stoic",
  },
  {
    id: "observation",
    title: "Observation",
    philosophy: "Can the observer be observed?",
    engineering: "What is watching the thing that watches?",
    body: "Vedānta calls the witness sākṣin and points out that you can never get behind it — whatever you observe is, by that fact, not the observer. Monitoring has the same regress, minus the serenity: the alerting pipeline is exactly as capable of failing silently as the service it watches, and something has to notice.",
    sourceId: "sakshi",
  },
];
