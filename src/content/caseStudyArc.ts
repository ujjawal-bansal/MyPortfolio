import type { CaseStudyArc } from "./projects";

/**
 * The eight steps every case study walks through, in order. Structure rather than
 * project content, so it lives here once and both the page and the dot rail read it —
 * on a case study the rail's dots are these steps, not the home page's sections.
 */

export interface ArcStep {
  /** Field on `CaseStudy["arc"]` holding this step's copy. */
  key: keyof CaseStudyArc;
  /** DOM id: the anchor the rail links to and the scroll spy watches. */
  id: string;
  label: string;
  /** Short form for the rail, which has no room for a sentence. */
  navLabel: string;
}

export const arcSteps: readonly ArcStep[] = [
  { key: "problem", id: "problem", label: "The problem", navLabel: "Problem" },
  { key: "question", id: "question", label: "The question", navLabel: "Question" },
  { key: "idea", id: "idea", label: "The idea", navLabel: "Idea" },
  { key: "system", id: "system", label: "The system", navLabel: "System" },
  {
    key: "engineeringProblem",
    id: "engineering-problem",
    label: "The engineering problem",
    navLabel: "Engineering problem",
  },
  { key: "solution", id: "solution", label: "The solution", navLabel: "Solution" },
  { key: "result", id: "result", label: "The result", navLabel: "Result" },
  { key: "learned", id: "learned", label: "What I learned", navLabel: "Learned" },
];
