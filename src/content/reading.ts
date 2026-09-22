/**
 * What is on the desk, beside the music in "When I'm not writing code".
 *
 * When `GOODREADS_USER_ID` is set, the books come from that Goodreads account's
 * "currently-reading" shelf, and failing that its most recently read (see
 * `lib/goodreads.ts`). This list is what shows until then, and whenever Goodreads has
 * nothing to say. It is Ujjawal's own list, recorded in docs/facts.md.
 *
 * Covers are Open Library's, and each one was checked by eye before it went in: the first
 * match Open Library returns for *Sambhog Se Samadhi Ki Or* is an unrelated image someone
 * attached to that record, and a cover fetched blind would have put it on this page.
 */

/** Three, like the tracks beside them, and for the same reason: a glimpse, not a shelf. */
export const MAX_BOOKS = 3;

export interface Book {
  title: string;
  author: string;
  /** A cover image, or null for a typographic stand-in. */
  cover: string | null;
  /** The book's page, when the source gives one. Never constructed. */
  href: string | null;
}

export const reading = {
  label: "Current reads",
  /**
   * An Osho discourse, a Hindi romance and a book called *Do Epic Shit*. The line admits
   * the range rather than pretending it is a curriculum.
   */
  line: "On the desk lately, in no particular order of seriousness.",
  /** Read out beside each cover by a screen reader: the cover itself is decorative. */
  by: "by",
  books: [
    {
      // As printed on the cover, checked against it.
      title: "संभोग से समाधि की ओर",
      author: "Osho",
      cover: "https://covers.openlibrary.org/b/id/13276865-M.jpg",
      href: null,
    },
    {
      title: "गुनाहों का देवता",
      author: "Dharamvir Bharati",
      cover: "https://covers.openlibrary.org/b/id/6781720-M.jpg",
      href: null,
    },
    {
      title: "Do Epic Shit",
      author: "Ankur Warikoo",
      cover: "https://covers.openlibrary.org/b/id/12550538-M.jpg",
      href: null,
    },
  ] satisfies Book[],
};
