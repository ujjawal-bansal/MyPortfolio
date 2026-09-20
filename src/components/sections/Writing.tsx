import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { posts, writingIntro } from "@/content/writing";

/**
 * Writing, as cards.
 *
 * Projects deliberately are not cards — each is a full-width entry whose ornament is its
 * own architecture. Posts are the opposite shape: short, equal in weight, read in any
 * order, so a grid of cards is right where a ranked list would not be.
 *
 * The card leads with the pivot rather than a summary. Each of these is one line built to
 * be remembered, which is a better hook than a paragraph's first sentence and is already
 * written — nothing here is generated to fill a card.
 */
export function Writing() {
  const meta = sectionById("writing");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      {/* The question all six are asking. It used to be this section's whole premise. */}
      <p className="mt-6 text-lg text-balance text-fg-muted measure">{writingIntro.answer}</p>

      <ul className="mt-14 grid gap-5 sm:grid-cols-2">
        {posts.map((post, index) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="group flex h-full flex-col rounded-sm border border-line/60 p-6 outline-offset-4 transition-colors duration-300 hover:border-accent/40 hover:bg-accent/[0.03] focus-visible:border-accent/40"
            >
              <span className="font-mono text-xs text-fg-ghost tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-3 font-serif text-2xl text-fg-strong transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
                {post.title}
              </h3>

              {/* The line built to be remembered, doing the work a summary usually does. */}
              <p className="mt-4 font-serif text-lg text-balance text-fg-faint italic">{post.pivot}</p>

              {/* `mt-auto`: cards in a row are different heights, and the affordance
                  belongs at the bottom edge of each rather than under its own text. */}
              <span className="mt-auto pt-6 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
                Read →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
