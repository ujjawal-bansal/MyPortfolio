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
    /** The button. Verified in docs/SOURCES.md — do not add Sanskrit without that. */
    label: string;
    devanagari: string;
    iast: string;
  };
  availability: {
    /**
     * Flip to false the day this stops being true and the whole line disappears —
     * a stale "available" is worse than none.
     */
    open: boolean;
    label: string;
  };
  hero: {
    /** Three beats, read one after another. Not a job title. */
    lines: readonly string[];
    name: string;
    /** The same name in Devanagari — see docs/SOURCES.md. Revealed on hover. */
    devanagariName: string;
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

  availability: {
    open: true,
    label: "Available for engineering roles",
  },

  contact: {
    headline: "Let's turn a thought into something that exists.",
    body: "That is the whole pipeline, and the only part I cannot do alone is the first bit. If you have one, I read everything.",
  },

  resumeCopy: {
    // Plain "Resume", not "Résumé": the CSS uppercases it to RESUME, and the accessible
    // name stays a word a screen reader reads rather than spells.
    label: "Resume",
    devanagari: "जीवनवृत्तम्",
    // Not rendered — it documents the Devanagari above it. Verified in docs/SOURCES.md,
    // where the etymology lives now that the button no longer carries a gloss.
    iast: "jīvanavṛttam",
  },

  hero: {
    lines: ["I build things.", "I question things.", "So far nobody has made me choose."],
    name: "Ujjawal Bansal",
    // ujjvala: bright, radiant — from ud- ("upward") + √jval ("to shine").
    devanagariName: "उज्ज्वल बंसल",
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
    // Hosted on Drive rather than in public/, so it can be swapped without a redeploy.
    href: "https://drive.google.com/file/d/1aq11ZFnlV0jAZEMWIKHjyE8bobIsuvVW/view",
    updated: PENDING,
  },
};
