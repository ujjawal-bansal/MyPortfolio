import type { Maybe } from "./types";

/**
 * Timeline. Every entry is from docs/facts.md — nothing is inferred, rounded, or
 * dressed up, and gaps stay gaps. A year that facts.md does not state is PENDING,
 * not a guess.
 *
 * Four entries by choice, not by omission. facts.md also records the AWS Academy Cloud
 * Foundations certificate and the Zidio summer internship; both are true and both were
 * deliberately dropped from the timeline, so do not "restore" them from facts.md. A
 * timeline that lists everything is a CV, and the CV is already a button in the hero.
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
    when: "Sep 2025 – Present",
    sortKey: "2025-09",
    title: "Content Lead",
    where: "GeeksforGeeks ABES Student Chapter",
    body: "Leading the writers now, after ten months of writing for people who had not yet decided whether they liked programming.",
    kind: "role",
  },
  {
    id: "stellaris-2026",
    when: "2026",
    sortKey: "2026-01",
    title: "Core organiser, Stellaris",
    where: "ABES Engineering College",
    body: "Pan-India: 1,600+ registrations, a $19,000 prize pool, GitHub as a gold sponsor. Running one is a different skill from winning one, and considerably less glamorous.",
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
