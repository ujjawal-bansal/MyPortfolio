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
  /**
   * This section belongs to another nav item. The hero and "Who am I?" are one
   * introduction — "I build things… Ujjawal Bansal", then the answer — so the Self dot
   * starts you at the hero and stays lit through both.
   */
  partOf?: string;
}

export const sections: readonly SectionMeta[] = [
  {
    id: "hero",
    title: "Ujjawal Bansal",
    navLabel: "Top",
    hiddenFromNav: true,
    partOf: "self",
  },
  {
    id: "self",
    title: "Who am I?",
    navLabel: "Self",
    kicker: "About, more or less",
  },
  {
    id: "projects",
    title: "Things that exist",
    navLabel: "Projects",
    kicker: "Proof",
  },
  {
    id: "how-i-think",
    title: "How I think",
    navLabel: "How I think",
    kicker: "Seven verbs",
  },
  {
    id: "writing",
    title: "Why does a developer read philosophy?",
    navLabel: "Writing",
    kicker: "Philosophy × Engineering",
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
    id: "beyond-code",
    title: "When I'm not writing code",
    navLabel: "Beyond code",
    kicker: "The rest of it",
  },
  {
    id: "contact",
    title: "Get in touch",
    navLabel: "Contact",
    kicker: "The end of the scroll",
  },
];

export const navSections = sections.filter((s) => !s.hiddenFromNav);

/**
 * Where a nav item scrolls to: the first section belonging to it. Self starts at the
 * hero, so clicking it shows "I build things… Ujjawal Bansal" and the answer below.
 */
export function anchorFor(navId: string): string {
  return sections.find((s) => s.id === navId || s.partOf === navId)?.id ?? navId;
}

/** Which nav item a section lights up. The hero lights Self. */
export function navIdFor(sectionId: string): string {
  return sections.find((s) => s.id === sectionId)?.partOf ?? sectionId;
}

export function sectionById(id: string): SectionMeta | undefined {
  return sections.find((s) => s.id === id);
}

/** Skip-link target. The hero is decorative enough that skipping into it is useless. */
export const mainContentId = "main-content";
