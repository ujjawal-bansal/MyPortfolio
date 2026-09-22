import { unstable_rethrow } from "next/navigation";
import { MAX_BOOKS, type Book } from "@/content/reading";

/**
 * Books from a Goodreads shelf.
 *
 * Goodreads retired its API in December 2020 and issues no keys. What it still publishes
 * is an RSS feed for every public shelf, which is all this needs: title, author, a cover
 * and the book's page. No key, no OAuth — only the account's numeric id, from its profile
 * URL. The account's shelves must be public.
 *
 * Fetched without a `cache` option, so it inherits the home page's revalidation, exactly
 * as the Spotify request does: one fetch per window, shared by every visitor. An explicit
 * no-store here would make the whole page dynamic again (see lib/spotify.ts).
 *
 * Null means "use the list in content/reading.ts": unconfigured, unreachable, or empty.
 */

const TIMEOUT_MS = 6_000;

function note(detail: string): void {
  console.error(`[goodreads] ${detail}`);
}

/** Just enough entity decoding for titles and author names. */
function decode(value: string): string {
  return value
    .replace(/^<!\[CDATA\[([\s\S]*)\]\]>$/, "$1")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function field(item: string, name: string): string {
  const match = item.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return match ? decode(match[1]) : "";
}

/** Exported for testing against a real feed. */
export function parseShelf(xml: string): Book[] {
  const items = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const books: Book[] = [];

  for (const item of items) {
    const title = field(item, "title");
    const author = field(item, "author_name");
    if (!title || !author) continue;

    const image = field(item, "book_large_image_url") || field(item, "book_image_url");
    const link = field(item, "link");
    books.push({
      title,
      author,
      // Goodreads serves a generic "no photo" image for coverless books; a typographic
      // stand-in is better than a picture of nothing.
      cover: image && !/nophoto/i.test(image) ? image : null,
      href: /^https:\/\/www\.goodreads\.com\//.test(link) ? link : null,
    });
    if (books.length >= MAX_BOOKS) break;
  }

  return books;
}

async function shelf(userId: string, name: string, extra = ""): Promise<Book[] | null> {
  try {
    const res = await fetch(
      `https://www.goodreads.com/review/list_rss/${encodeURIComponent(userId)}?shelf=${name}${extra}`,
      { signal: AbortSignal.timeout(TIMEOUT_MS), headers: { "User-Agent": "Mozilla/5.0" } },
    );
    if (!res.ok) {
      note(`shelf "${name}" answered ${res.status} — is the profile public?`);
      return null;
    }
    return parseShelf(await res.text());
  } catch (error) {
    unstable_rethrow(error);
    note(`shelf "${name}": ${error instanceof Error ? `${error.name}: ${error.message}` : String(error)}`);
    return null;
  }
}

/**
 * What is being read now; failing that, what was read most recently. Null if Goodreads is
 * not configured or has neither.
 */
export async function currentReads(): Promise<Book[] | null> {
  const userId = process.env.GOODREADS_USER_ID?.trim();
  if (!userId) return null;
  if (!/^\d+$/.test(userId)) {
    note(`GOODREADS_USER_ID should be the number from the profile URL, got ${userId.length} chars`);
    return null;
  }

  const current = await shelf(userId, "currently-reading");
  if (current && current.length > 0) return current;

  const read = await shelf(userId, "read", "&sort=date_read&order=d");
  return read && read.length > 0 ? read : null;
}
