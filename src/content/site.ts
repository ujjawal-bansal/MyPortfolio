import { PENDING, type Link, type Maybe } from "./types";

export interface Site {
  name: string;
  shortName: string;
  role: string;
  education: {
    degree: string;
    institution: string;
    graduates: number;
  };
  /** Used for <title>/description. Plain on purpose — search results are not the place to be clever. */
  meta: {
    title: string;
    description: string;
  };
  contact: {
    /** Not "let's connect". */
    headline: string;
    body: string;
  };
  resumeCopy: {
    headline: string;
    note: string;
  };
  footer: {
    /** The loop: the site ends where it began. */
    loop: readonly string[];
    line: string;
  };
  hero: {
    /** Three beats, read one after another. Not a job title. */
    lines: readonly string[];
    name: string;
    disciplines: readonly string[];
    /**
     * A Sanskrit line, unexplained. It resolves in the philosophy section;
     * here it is only an invitation. `verseId` points into philosophy.ts.
     */
    whisper: { verseId: string; devanagari: string };
  };
  links: {
    github: Link;
    email: Link;
    linkedin: Link;
    x: Link;
  };
  resume: {
    href: Maybe<string>;
    /** ISO date of the file currently linked. */
    updated: Maybe<string>;
  };
}

export const site: Site = {
  name: "Ujjawal Bansal",
  shortName: "Ujjawal",
  role: "Software developer",
  education: {
    degree: "B.Tech, Computer Science & Engineering",
    institution: "ABES Engineering College, Ghaziabad",
    graduates: 2027,
  },

  meta: {
    title: "Ujjawal Bansal",
    description:
      "Software developer and CS student. I build systems that run in the real world, and I read philosophy for the same reason I debug — to find the assumption underneath.",
  },

  contact: {
    headline: "Let's turn a thought into something that exists.",
    body: "That is the whole pipeline, and the only part I cannot do alone is the first bit. If you have one, I read everything.",
  },

  resumeCopy: {
    headline: "For those who prefer the conventional version of me.",
    note: "Two pages. Reverse chronological. No particles.",
  },

  footer: {
    loop: ["Thought", "Action", "Experience", "Thought"],
    line: "Still figuring it out. Building anyway.",
  },

  hero: {
    lines: ["I build things.", "I question things.", "So far nobody has made me choose."],
    name: "Ujjawal Bansal",
    disciplines: ["Computer Science", "Software Engineering", "Philosophy"],
    whisper: { verseId: "aham-brahmasmi", devanagari: "अहं ब्रह्मास्मि" },
  },

  links: {
    github: {
      label: "GitHub",
      href: "https://github.com/ujjawal-bansal",
      display: "ujjawal-bansal",
      external: true,
    },
    email: {
      label: "Email",
      href: "mailto:ujjawalbansal.tech@gmail.com",
      display: "ujjawalbansal.tech@gmail.com",
    },
    linkedin: {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/ujjawalbansal",
      display: "in/ujjawalbansal",
      external: true,
    },
    x: {
      label: "X",
      href: "https://x.com/ujjawal__bansal",
      display: "@ujjawal__bansal",
      external: true,
    },
  },

  resume: {
    href: PENDING,
    updated: PENDING,
  },
};
