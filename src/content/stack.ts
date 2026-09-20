/**
 * Tech stack — not a logo grid.
 *
 * Framing: the instruments used to turn thought into systems. Each group gets a line
 * that says what that layer is *for*, so the section reads as a point of view rather
 * than an inventory.
 */

export interface StackItem {
  name: string;
}

export interface StackGroup {
  id: string;
  label: string;
  /** What this layer is for. One line. */
  line: string;
  /**
   * Where this sits on the thought → system path (BRIEF §4). The section is arranged by
   * this rather than by category, because "Languages / Frontend / Backend" is a logo
   * grid with the logos removed.
   */
  stage: string;
  items: readonly StackItem[];
}

export const stack: readonly StackGroup[] = [
  {
    id: "languages",
    stage: "Think",
    label: "Languages",
    line: "Different grammars for the same few ideas.",
    items: [
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "Java" },
      { name: "Python" },
      { name: "C++" },
      { name: "SQL" },
    ],
  },
  {
    id: "frontend",
    stage: "Show",
    label: "Frontend",
    line: "Where the system meets someone who did not build it.",
    items: [{ name: "React" }, { name: "Next.js" }, { name: "Vite" }, { name: "Tailwind CSS" }],
  },
  {
    id: "backend",
    stage: "Decide",
    label: "Backend",
    line: "Where the rules live.",
    items: [{ name: "Node.js" }, { name: "Express" }],
  },
  {
    id: "databases",
    stage: "Remember",
    label: "Data",
    line: "The only part that remembers anything after the process exits.",
    items: [{ name: "PostgreSQL" }, { name: "MongoDB" }, { name: "Supabase" }],
  },
  {
    id: "ai",
    stage: "Judge",
    label: "AI",
    line: "Useful for judgement. Kept away from logic.",
    items: [{ name: "Groq" }, { name: "LLM pipelines" }, { name: "Zod" }],
  },
  {
    id: "tools",
    stage: "Keep honest",
    label: "Tools",
    line: "Unremarkable, and used every day.",
    items: [{ name: "Git" }, { name: "GitHub" }, { name: "Postman" }, { name: "VS Code" }],
  },
];
