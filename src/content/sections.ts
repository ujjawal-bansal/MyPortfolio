/**
 * The page, in order. One source of truth for ids, headings and nav labels — the
 * nav, the scroll spy and the sections themselves all read from here, so adding a
 * section means editing one array.
 */

export interface SectionMeta {
  /** DOM id and anchor target. */
  id: string;
  /** The section's real heading. */
  title: string;
  /** Short label for the nav. The dot rail has no room for a sentence. */
  navLabel: string;
  /** Small line above the heading. Optional. */
  kicker?: string;
  /** Excluded from the nav — the hero and the footer are reachable without it. */
  hiddenFromNav?: boolean;
}

export const sections: readonly SectionMeta[] = [
  {
    id: "hero",
    title: "Ujjawal Bansal",
    navLabel: "Top",
    hiddenFromNav: true,
  },
  {
    id: "self",
    title: "Who is Ujjawal?",
    navLabel: "Self",
    kicker: "About, more or less",
  },
  {
    id: "how-i-think",
    title: "How I think",
    navLabel: "How I think",
    kicker: "Seven verbs",
  },
  {
    id: "philosophy-engineering",
    title: "Why does a developer read philosophy?",
    navLabel: "Philosophy × Engineering",
    kicker: "Philosophy × Engineering",
  },
  {
    id: "projects",
    title: "Things that exist",
    navLabel: "Projects",
    kicker: "Proof",
  },
  {
    id: "shlokas",
    title: "Words that refuse to be scrolled past",
    navLabel: "Thoughts",
    kicker: "Four sentences, one from each Veda",
  },
  {
    id: "beyond-code",
    title: "When I'm not writing code",
    navLabel: "Beyond code",
    kicker: "The rest of it",
  },
  {
    id: "journey",
    title: "Journey",
    navLabel: "Journey",
    kicker: "What actually happened",
  },
  {
    id: "stack",
    title: "The instruments I use to turn thought into systems",
    navLabel: "Stack",
    kicker: "Tools, not trophies",
  },
  {
    id: "contact",
    title: "Get in touch",
    navLabel: "Contact",
    kicker: "The end of the scroll",
  },
];

export const navSections = sections.filter((s) => !s.hiddenFromNav);

export function sectionById(id: string): SectionMeta | undefined {
  return sections.find((s) => s.id === id);
}

/** Skip-link target. The hero is decorative enough that skipping into it is useless. */
export const mainContentId = "main-content";
