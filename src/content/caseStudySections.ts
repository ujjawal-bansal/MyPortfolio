/**
 * The four sections every case study shows, in order:
 *
 *   Problem → Solution → Architecture → Technical depth
 *
 * Progressive disclosure: most important first, deepest last. A reviewer who stops
 * after two sections still has why it exists and what was built. Each section is short
 * on purpose — see the length limits on `CaseStudyStory` in projects.ts.
 */

export interface CaseStudySection {
  /** DOM id; the constellation also times itself against these. */
  id: "problem" | "solution" | "architecture" | "technical-depth";
  label: string;
}

export const caseStudySections: readonly CaseStudySection[] = [
  { id: "problem", label: "The problem" },
  { id: "solution", label: "The solution" },
  { id: "architecture", label: "Architecture" },
  { id: "technical-depth", label: "Technical depth" },
];
