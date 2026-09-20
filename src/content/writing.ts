/**
 * Writing.
 *
 * One post so far. It began as the "Philosophy × Engineering" section — the same question
 * asked twice, once in each vocabulary, with a rule down the middle — and the six pairings
 * are its six parts, unchanged: every word here was already on the site.
 *
 * The shape is built for more. `posts` is a list, the section renders one card per entry
 * and the route is `/writing/[slug]`, so a second post is one object in this file and
 * nothing else. Parts are structure a post may use, not a requirement — one that is plain
 * prose can carry a single part, or this interface can grow a `body` when one needs it.
 *
 * No dates. facts.md records none and inventing publication dates would be a small lie
 * told in metadata. Add `published` to `Post` the day real ones exist, and sort by it.
 */

/** One section of a post. The mirror is the shape: one question in two vocabularies. */
export interface PostPart {
  /** Anchor id within the post, so the contents list can link to it. */
  id: string;
  title: string;
  /** The question in philosophy's vocabulary. */
  philosophy: string;
  /** The same question in engineering's. The mirror image, not a loose rhyme. */
  engineering: string;
  /** The line that does the work. Short enough to be remembered. */
  pivot: string;
  /** Two or three sentences closing the gap. Not padded out to look like an essay. */
  body: string;
  /** Points at a verse or citation in docs/SOURCES.md. */
  sourceId?: string;
}

export interface Post {
  /** URL segment. Stable — changing it breaks any link anyone has kept. */
  slug: string;
  title: string;
  /** The card's hook and the post's opening line. Does the work a summary would. */
  standfirst: string;
  parts: readonly PostPart[];
}

export const posts: readonly Post[] = [
  {
    slug: "why-a-developer-reads-philosophy",
    title: "Why does a developer read philosophy?",
    standfirst:
      "Because both jobs are the same activity: finding the assumption underneath the thing everyone agrees on, and checking whether it holds.",
    parts: [
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
    ],
  },
];

export function postBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

/** The next one to read, wrapping at the end. Undefined while there is only one. */
export function postAfter(slug: string): Post | undefined {
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1 || posts.length < 2) return undefined;
  return posts[(index + 1) % posts.length];
}
