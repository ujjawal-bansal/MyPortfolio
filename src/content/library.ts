import type { Maybe } from "./types";

/**
 * The shelf.
 *
 * It is empty, and that is the honest state: docs/facts.md records the reading list as
 * unfilled, and the brief is explicit about not fabricating books Ujjawal has read. It
 * used to hold fifteen dashed rectangles labelled "empty" so the layout could be tested,
 * which made a finished section look broken.
 *
 * So the shelves are the content now. Each one says what it is for, which is true today
 * and stays true after books land on it. Adding a `Book` here makes a spine stand up on
 * its shelf — nothing else has to change.
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
  /** One line about what this shelf is for. True whether or not anything stands on it. */
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

/**
 * States the absence outright, the way the waveform's caption does, rather than leaving
 * the section looking unfinished. Delete this line the day a book lands and it stops
 * being true.
 */
export const shelfNote = "Nothing on it yet. A reading list is easy to write and hard to mean.";

/**
 * Empty on purpose. Real entries go here — one object per book — and the shelf renders
 * them without any other change.
 */
export const books: readonly Book[] = [];

export function booksByCategory(categoryId: string): readonly Book[] {
  return books.filter((b) => b.categoryId === categoryId);
}

/** Derived, not a flag: a hand-maintained boolean goes stale the day books are added. */
export const shelfIsEmpty = books.length === 0;
