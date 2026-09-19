import type { CaseStudyArc } from "./projects";

/**
 * The four sections every case study shows, in order:
 *
 *   Problem → Solution → Architecture → Technical depth
 *
 * Progressive disclosure: the most important first, the deepest last. A reviewer who
 * stops after two sections still has why it exists and what was built; the architecture
 * then zooms out to its structure; technical depth rewards whoever keeps going.
 *
 * Nothing is dropped from the verified copy — the eight fields on `CaseStudy["arc"]`
 * are folded into four sections rather than deleted.
 */

export interface CaseStudySection {
  /** DOM id, and the anchor the constellation times itself against. */
  id: string;
  label: string;
  /** Paragraphs, in order, from `CaseStudy["arc"]`. */
  body: readonly (keyof CaseStudyArc)[];
  /** Set large and italic after the body — the problem at its sharpest. */
  question?: keyof CaseStudyArc;
  /** Shows the architecture diagram. */
  diagram?: boolean;
  /** Shows the project's detailed technical notes. */
  notes?: boolean;
  /** A closing line, set apart: the lesson the whole page arrives at. */
  takeaway?: keyof CaseStudyArc;
}

export const caseStudySections: readonly CaseStudySection[] = [
  { id: "problem", label: "The problem", body: ["problem"], question: "question" },
  { id: "solution", label: "The solution", body: ["idea", "result"] },
  { id: "architecture", label: "Architecture", body: ["system"], diagram: true },
  {
    id: "technical-depth",
    label: "Technical depth",
    body: ["engineeringProblem", "solution"],
    notes: true,
    takeaway: "learned",
  },
];
