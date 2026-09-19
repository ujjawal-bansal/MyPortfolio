/**
 * Tech stack — not a logo grid.
 *
 * Framing: the instruments used to turn thought into systems. Each group gets a line
 * that says what that layer is *for*, so the section reads as a point of view rather
 * than an inventory.
 */

export interface StackItem {
  name: string;
  /** Optional half-line. Used sparingly — a note on every item is noise. */
  note?: string;
}

export interface StackGroup {
  id: string;
  label: string;
  /** What this layer is for. One line. */
  line: string;
  items: readonly StackItem[];
}

export const stackIntro = "The instruments. Most of them are ordinary; that is rather the point.";

export const stack: readonly StackGroup[] = [
  {
    id: "languages",
    label: "Languages",
    line: "Different grammars for the same few ideas.",
    items: [
      { name: "TypeScript", note: "Most of what I write" },
      { name: "JavaScript" },
      { name: "Java" },
      { name: "Python" },
      { name: "C++" },
      { name: "SQL", note: "Underrated as a way of thinking" },
    ],
  },
  {
    id: "frontend",
    label: "Frontend",
    line: "Where the system meets someone who did not build it.",
    items: [{ name: "React" }, { name: "Next.js" }, { name: "Vite" }, { name: "Tailwind CSS" }],
  },
  {
    id: "backend",
    label: "Backend",
    line: "Where the rules live.",
    items: [{ name: "Node.js" }, { name: "Express" }],
  },
  {
    id: "databases",
    label: "Data",
    line: "The only part that remembers anything after the process exits.",
    items: [
      { name: "PostgreSQL", note: "Constraints as a design tool, not a formality" },
      { name: "MongoDB" },
      { name: "Supabase" },
    ],
  },
  {
    id: "ai",
    label: "AI",
    line: "Useful for judgement. Kept away from logic.",
    items: [
      { name: "Groq" },
      { name: "LLM pipelines", note: "Validated at every boundary" },
      { name: "Zod", note: "The thing standing between a model and the database" },
    ],
  },
  {
    id: "tools",
    label: "Tools",
    line: "Unremarkable, and used every day.",
    items: [{ name: "Git" }, { name: "GitHub" }, { name: "Postman" }, { name: "VS Code" }],
  },
];
