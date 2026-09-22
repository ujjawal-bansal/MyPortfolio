import Image from "next/image";
import { reading, type Book } from "@/content/reading";
import { currentReads } from "@/lib/goodreads";

/**
 * Current reads: three books, beside the music.
 *
 * Deliberately small, and built from the music list's parts — the mono index, the serif
 * title, the quiet author line — so the two read as one section's two halves, not as two
 * features. The one addition is the cover: a thumbnail, never a card, sitting a little
 * muted in the page's warm tones and coming into full colour when a book is attended to.
 *
 * A server component. The books come from Goodreads when it is configured and has any,
 * and from content/reading.ts otherwise; either way they arrive in the first HTML.
 */
export async function Reading() {
  const books = ((await currentReads()) ?? reading.books).slice(0, 3);

  return (
    <div className="mt-16 border-t border-line/50 pt-8">
      <p className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{reading.label}</p>
      <p className="mt-3 leading-relaxed text-fg measure">{reading.line}</p>

      {/* Three columns on a wide screen, as the tracks are; rows on a phone. */}
      <ul className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
        {books.map((book, index) => (
          <li key={`${book.title}-${book.author}`}>
            {book.href ? (
              <a
                href={book.href}
                target="_blank"
                rel="noreferrer noopener"
                className="group/book flex items-start gap-4 outline-offset-4"
              >
                <Entry book={book} index={index} />
              </a>
            ) : (
              <div className="group/book flex items-start gap-4">
                <Entry book={book} index={index} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Hindi titles are written in Hindi; they need the Devanagari face, not the Latin serif. */
const DEVANAGARI = /[\u0900-\u097F]/;

function Entry({ book, index }: { book: Book; index: number }) {
  const hindi = DEVANAGARI.test(book.title);
  return (
    <>
      <Cover book={book} />
      <span className="min-w-0">
        <span className="block font-mono text-[0.625rem] tracking-[0.2em] text-fg-faint tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          lang={hindi ? "hi" : undefined}
          className={
            hindi
              ? // Devanagari reads small against a Latin serif at the same size, and its
                // base stylesheet leading (1.9, for verses) is far too airy for a title.
                "mt-1.5 block font-devanagari text-xl leading-snug text-balance text-fg-strong"
              : "mt-1.5 block font-serif text-lg leading-snug font-light text-balance text-fg-strong"
          }
        >
          {book.title}
        </span>
        <span className="mt-0.5 block text-sm text-fg-muted">
          <span className="sr-only">{reading.by} </span>
          {book.author}
        </span>
      </span>
    </>
  );
}

/**
 * The cover, 2:3. Decorative — the title beside it says everything the picture does — so
 * its alt is empty. Muted at rest: a full-colour book jacket is the loudest thing that
 * could sit in this section, and a yellow one especially.
 */
function Cover({ book }: { book: Book }) {
  const frame =
    "relative h-18 w-12 shrink-0 overflow-hidden rounded-[2px] shadow-[0_8px_18px_-10px_var(--print-shadow)]";

  if (!book.cover) {
    return (
      <span aria-hidden className={`${frame} grid place-items-center border border-line bg-bg-raised`}>
        <span className="font-serif text-lg text-fg-faint">{book.title.charAt(0)}</span>
      </span>
    );
  }

  return (
    <span className={frame}>
      <Image
        src={book.cover}
        alt=""
        fill
        sizes="48px"
        className="object-cover grayscale-[35%] sepia-[15%] transition-[filter] duration-1000 ease-[var(--ease-out-quart)] group-hover/book:grayscale-0 group-hover/book:sepia-0 group-focus-visible/book:grayscale-0 group-focus-visible/book:sepia-0"
      />
    </span>
  );
}
