import { projects } from "./projects";
import { site } from "./site";
import { isPending } from "./types";

/**
 * The hidden terminal (⌘K / Ctrl+K).
 *
 * A command map, not a shell. Commands return lines plus an optional effect; the
 * component decides how to render and what to do. Anything marked `hidden` stays out of
 * `help` — it is there for whoever types it anyway.
 */

export interface CommandResult {
  lines: readonly string[];
  /** Handled by the component: clearing, closing, or starting the removal. */
  effect?: "clear" | "close" | "neti-neti";
  /** A route to push. Used by `open`. */
  navigate?: string;
  /** A URL to open in a new tab. Used by `resume`. */
  externalHref?: string;
}

export interface Command {
  name: string;
  summary: string;
  aliases?: readonly string[];
  hidden?: boolean;
  /** Completions for the first argument, so Tab works past the command name. */
  completions?: () => readonly string[];
  run: (args: readonly string[]) => CommandResult;
}

const lines = (...value: string[]): CommandResult => ({ lines: value });

export const commands: readonly Command[] = [
  {
    name: "help",
    summary: "What you can type here",
    aliases: ["?", "commands"],
    run: () => ({
      lines: [
        "Available:",
        "",
        ...commands.filter((c) => !c.hidden).map((c) => `  ${c.name.padEnd(12)} ${c.summary}`),
        "",
        "Tab completes. ↑ ↓ walk the history. Esc leaves.",
        "Not everything is listed.",
      ],
    }),
  },

  {
    name: "whoami",
    summary: "The short version",
    run: () =>
      lines(
        site.name,
        "",
        "Student",
        "Builder",
        "Reader",
        "Observer",
        "",
        `${site.education.degree}, ${site.education.institution}.`,
        `Graduating ${site.education.graduates}.`,
      ),
  },

  {
    name: "projects",
    summary: "Three things that exist",
    aliases: ["ls", "work"],
    run: () => ({
      lines: [
        ...projects.map(
          (p) => `${p.slug.padEnd(12)} ${p.name.padEnd(12)} ${p.status === "live" ? "live" : "built"}`,
        ),
        "",
        "`open <name>` for the full case study.",
      ],
    }),
  },

  {
    name: "open",
    summary: "Open a case study — open <project>",
    completions: () => projects.map((p) => p.slug),
    run: (args) => {
      const slug = args[0];
      if (!slug) {
        return {
          lines: ["open what?", "", ...projects.map((p) => `  ${p.slug}`)],
        };
      }
      const project = projects.find((p) => p.slug === slug || p.name.toLowerCase() === slug);
      if (!project) return lines(`no project called "${slug}"`, "", "Try `projects`.");
      return { lines: [`Opening ${project.name}…`], navigate: `/work/${project.slug}` };
    },
  },

  {
    name: "philosophy",
    summary: "The other half",
    run: () =>
      lines(
        "Advaita Vedanta",
        "Stoicism",
        "Questions without easy answers",
        "",
        "Every verse on this site is cited. Nothing here is decorative.",
        "See docs/SOURCES.md in the repository.",
      ),
  },

  {
    name: "stack",
    summary: "The instruments",
    run: () =>
      lines(
        "TypeScript · JavaScript · Java · Python · C++ · SQL",
        "React · Next.js · Vite · Tailwind",
        "Node · Express",
        "PostgreSQL · MongoDB · Supabase",
        "",
        "Nothing exotic. That is usually the correct answer.",
      ),
  },

  {
    name: "resume",
    summary: "The conventional version",
    aliases: ["cv"],
    run: () => {
      if (isPending(site.resume.href)) {
        return lines("Not uploaded yet.", "", "`contact` works in the meantime.");
      }
      return { lines: ["Opening the PDF…"], externalHref: site.resume.href };
    },
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
      return { lines: rows.length > 0 ? rows : ["Not wired up yet."] };
    },
  },

  {
    name: "why",
    summary: "Why build this instead of a normal portfolio",
    run: () =>
      lines(
        "Because a list of technologies tells you what I have used,",
        "and almost nothing about how I decide anything.",
      ),
  },

  {
    name: "clear",
    summary: "Clear the screen",
    aliases: ["cls"],
    run: () => ({ lines: [], effect: "clear" }),
  },

  {
    name: "exit",
    summary: "Return to the surface",
    aliases: ["quit", "q"],
    run: () => ({ lines: ["Returning to the surface."], effect: "close" }),
  },

  // ---- Unlisted ------------------------------------------------------------

  {
    name: "neti-neti",
    summary: "Not this, not this",
    hidden: true,
    run: () => ({ lines: ["नेति नेति", "", "Removing what you are not."], effect: "neti-neti" }),
  },
  {
    name: "sudo",
    summary: "Elevate privileges",
    hidden: true,
    run: () => lines("Nice try.", "", "Also — whose permission were you expecting to need?"),
  },
  {
    name: "sakshi",
    summary: "The witness",
    hidden: true,
    run: () => lines("साक्षिन्", "", "The one reading this line is not on the screen."),
  },
  {
    name: "rm",
    summary: "Remove",
    hidden: true,
    run: () => lines("Refusing.", "", "Try `neti-neti` — it removes things properly."),
  },
  {
    name: "cogito",
    summary: "I think, therefore",
    hidden: true,
    run: () =>
      lines(
        "Descartes got a self out of it.",
        "The Upanishads would ask who is watching the thinking.",
        "",
        "Both arguments are still running.",
      ),
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

export function resolveCommand(name: string): Command | undefined {
  return index.get(name.trim().toLowerCase());
}

/** Every typeable name, for Tab completion. Hidden commands complete once fully typed. */
export function completionsFor(input: string): string[] {
  const trimmed = input.trimStart();
  const [head, ...rest] = trimmed.split(/\s+/);

  // Completing an argument.
  if (rest.length > 0 || /\s$/.test(trimmed)) {
    const command = resolveCommand(head);
    const options = command?.completions?.() ?? [];
    const partial = rest[0] ?? "";
    return options.filter((option) => option.startsWith(partial)).map((o) => `${head} ${o}`);
  }

  // Completing the command name. Hidden commands are offered only once the prefix is
  // unambiguous enough to show the person already knows it exists.
  return [...index.keys()]
    .filter((name) => name.startsWith(head))
    .filter((name) => {
      const command = index.get(name);
      return !command?.hidden || head.length >= 2;
    })
    .sort();
}
