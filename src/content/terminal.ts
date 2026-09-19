import { projects } from "./projects";
import { site } from "./site";
import { isPending } from "./types";

/**
 * Hidden terminal (Cmd/Ctrl + K).
 *
 * A command map, not a shell. Output is plain lines; the component decides how to
 * render them. Commands marked `hidden` do not appear in `help` — they are there for
 * whoever types them anyway.
 */

export interface Command {
  name: string;
  /** Shown by `help`. */
  summary: string;
  /** Extra names that run the same command. */
  aliases?: readonly string[];
  /** Not listed by `help`. */
  hidden?: boolean;
  /**
   * Plain output lines. A function so output can read live content.
   * Side effects (clearing, closing, triggering Neti Neti) are signalled by `effect`.
   */
  run: () => readonly string[];
  effect?: "clear" | "close" | "neti-neti" | "theme";
}

const listed = (): readonly Command[] => commands.filter((c) => !c.hidden);

export const commands: readonly Command[] = [
  {
    name: "help",
    summary: "What you can type here",
    aliases: ["?", "commands"],
    run: () => [
      "Available:",
      "",
      ...listed().map((c) => `  ${c.name.padEnd(12)} ${c.summary}`),
      "",
      "Not everything is listed.",
    ],
  },
  {
    name: "whoami",
    summary: "The short version",
    run: () => [
      site.name,
      "",
      "Student",
      "Builder",
      "Reader",
      "Observer",
      "",
      `${site.education.degree}, ${site.education.institution}.`,
      `Graduating ${site.education.graduates}.`,
    ],
  },
  {
    name: "projects",
    summary: "Three things that exist",
    aliases: ["ls"],
    run: () => [
      ...projects.map((p) => `${p.name.padEnd(12)} ${p.tagline}`),
      "",
      "Type `open <name>` for the full case study.",
    ],
  },
  {
    name: "philosophy",
    summary: "The other half",
    run: () => [
      "Advaita Vedanta",
      "Stoicism",
      "Questions without easy answers",
      "",
      "Sources are cited. Nothing here is decorative.",
    ],
  },
  {
    name: "stack",
    summary: "The instruments",
    run: () => [
      "TypeScript · JavaScript · Java · Python · C++ · SQL",
      "React · Next.js · Vite · Tailwind",
      "Node · Express",
      "PostgreSQL · MongoDB · Supabase",
      "",
      "Nothing exotic. That is usually the correct answer.",
    ],
  },
  {
    name: "contact",
    summary: "How to reach me",
    run: () => {
      const rows: string[] = [];
      for (const link of Object.values(site.links)) {
        if (isPending(link.href)) continue;
        const shown = link.display && !isPending(link.display) ? link.display : link.href;
        rows.push(`${link.label.padEnd(10)} ${shown}`);
      }
      return rows.length > 0 ? rows : ["Not wired up yet. Check back."];
    },
  },
  {
    name: "why",
    summary: "Why build this instead of a normal portfolio",
    run: () => [
      "Because a list of technologies tells you what I have used,",
      "and almost nothing about how I decide anything.",
    ],
  },
  {
    name: "clear",
    summary: "Clear the screen",
    aliases: ["cls"],
    run: () => [],
    effect: "clear",
  },
  {
    name: "exit",
    summary: "Return to the surface",
    aliases: ["quit", "q"],
    run: () => ["Returning to the surface."],
    effect: "close",
  },

  // ---- Unlisted ----------------------------------------------------------

  {
    name: "neti-neti",
    summary: "Not this, not this",
    hidden: true,
    run: () => ["नेति नेति", "", "Removing what you are not.", ""],
    effect: "neti-neti",
  },
  {
    name: "sudo",
    summary: "Elevate privileges",
    hidden: true,
    run: () => ["Nice try.", "", "Also — whose permission were you expecting to need?"],
  },
  {
    name: "sakshi",
    summary: "The witness",
    hidden: true,
    run: () => ["साक्षिन्", "", "The one reading this line is not on the screen."],
  },
  {
    name: "rm",
    summary: "Remove",
    hidden: true,
    run: () => ["Refusing.", "", "Try `neti-neti` — it removes things properly."],
  },
  {
    name: "cogito",
    summary: "I think, therefore",
    hidden: true,
    run: () => [
      "Descartes got a self out of it.",
      "The Upanishads would ask who is watching the thinking.",
      "",
      "Both arguments are still running.",
    ],
  },
];

export const prompt = "ujjawal@portfolio";

export const banner: readonly string[] = [
  "Type `help` if you want the map.",
  "Type something else if you would rather not have one.",
];

export const notFound = (input: string): readonly string[] => [
  `${input}: not found`,
  "",
  "`help` lists most of it.",
];

const index = new Map<string, Command>();
for (const command of commands) {
  index.set(command.name, command);
  for (const alias of command.aliases ?? []) index.set(alias, command);
}

export function resolveCommand(input: string): Command | undefined {
  return index.get(input.trim().toLowerCase());
}
