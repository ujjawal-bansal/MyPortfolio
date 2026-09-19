import { PENDING, type Maybe } from "./types";

/**
 * Timeline. Every entry is from docs/facts.md — nothing is inferred, rounded, or
 * dressed up, and gaps stay gaps. A year that facts.md does not state is PENDING,
 * not a guess.
 */

export interface Milestone {
  id: string;
  /** Display label for the date: "2023", "Jan 2025", "Dec 2024 – Sep 2025". */
  when: Maybe<string>;
  /** Sort key. ISO year-month of the start. */
  sortKey: Maybe<string>;
  title: string;
  /** Organisation, where there is one. */
  where?: string;
  /** One or two lines. Plain. */
  body?: string;
  kind: "education" | "role" | "certification" | "internship" | "event";
  /** True for things that have not happened yet — rendered differently. */
  future?: boolean;
}

export const journey: readonly Milestone[] = [
  {
    id: "btech-start",
    when: "2023",
    sortKey: "2023-01",
    title: "Started B.Tech, Computer Science & Engineering",
    where: "ABES Engineering College, Ghaziabad",
    kind: "education",
  },
  {
    id: "gfg-chapter",
    when: "Dec 2024 – Sep 2025",
    sortKey: "2024-12",
    title: "Content Coordinator, then Content Lead",
    where: "GeeksforGeeks ABES Student Chapter",
    body: "Ten months of writing for people who had not yet decided whether they liked programming.",
    kind: "role",
  },
  {
    id: "aws-cloud-foundations",
    when: "Jan 2025",
    sortKey: "2025-01",
    title: "AWS Academy Cloud Foundations",
    kind: "certification",
  },
  {
    id: "zidio",
    when: PENDING,
    sortKey: PENDING,
    title: "Summer internship",
    where: "Zidio Development",
    body: "A blogging platform on the MERN stack.",
    kind: "internship",
  },
  {
    id: "stellaris-2026",
    when: "2026",
    sortKey: "2026-01",
    title: "Core organiser, Stellaris",
    where: "ABES Engineering College",
    body: "Campus hackathon, with GitHub as a gold sponsor. Running one is a different skill from winning one, and considerably less glamorous.",
    kind: "event",
  },
  {
    id: "graduation",
    when: "2027",
    sortKey: "2027-01",
    title: "Graduation",
    kind: "education",
    future: true,
  },
];

/** Shown near the timeline, so the empty years read as honesty rather than omission. */
export const journeyNote =
  "Only what actually happened. The years in between were mostly reading documentation, which does not make a good timeline entry.";
