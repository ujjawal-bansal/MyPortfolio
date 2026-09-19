import { PENDING, type Maybe } from "./types";

/**
 * Reading archive.
 *
 * ⚠️ Every entry below is a PLACEHOLDER. docs/facts.md records the reading list as
 * unfilled, and the brief is explicit: do not fabricate books Ujjawal has read.
 * These exist so the UI can be built and laid out. They must be replaced before
 * this section ships — see `libraryIsPlaceholder`.
 */

export interface Book {
  id: string;
  title: Maybe<string>;
  author: Maybe<string>;
  categoryId: string;
  /** Ujjawal's own line about it. Not a blurb, not a review. */
  note: Maybe<string>;
  status: "reading" | "read" | "returning-to" | "unread";
  year?: Maybe<string>;
}

export interface Category {
  id: string;
  label: string;
  /** One line about what this shelf is for. */
  line: string;
}

export const categories: readonly Category[] = [
  {
    id: "vedanta",
    label: "Vedanta",
    line: "Where most of the site's quieter half comes from.",
  },
  {
    id: "stoicism",
    label: "Stoicism",
    line: "Practical to the point of bluntness.",
  },
  {
    id: "existentialism",
    label: "Existentialism",
    line: "The same questions, asked by people with worse weather.",
  },
  {
    id: "philosophy",
    label: "Philosophy",
    line: "Everything that refuses the other three shelves.",
  },
  {
    id: "fiction",
    label: "Fiction",
    line: "Occasionally the most direct route.",
  },
];

/** Placeholder shelf. Three slots per category so the layout can be tested at realistic density. */
export const books: readonly Book[] = categories.flatMap((category) =>
  [1, 2, 3].map((n): Book => ({
    id: `${category.id}-${n}`,
    title: PENDING,
    author: PENDING,
    categoryId: category.id,
    note: PENDING,
    status: "unread",
  })),
);

/**
 * Guard for the whole section. While true, the section must either stay unpublished
 * or render an explicit "not filled in yet" state — never placeholder rows dressed
 * up as a reading list.
 */
export const libraryIsPlaceholder = true;

export function booksByCategory(categoryId: string): readonly Book[] {
  return books.filter((b) => b.categoryId === categoryId);
}
