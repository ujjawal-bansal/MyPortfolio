import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { posts } from "@/content/writing";

/**
 * Writing, as cards. One so far.
 *
 * The card sits in the left column of a two-column grid rather than stretching to fill
 * the row. The whole site holds its content to a left measure and leaves the right to the
 * scene; a lone card spanning 1136px would be the one banner on the page. A second post
 * fills the gap on its own, with no layout change.
 *
 * It leads with the standfirst and then names its parts, because six of them is the
 * argument for reading it — a card that only showed a title would undersell the post it
 * points at.
 */
export function Writing() {
  const meta = sectionById("writing");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/${post.slug}`}
              className="group flex h-full flex-col rounded-sm border border-line/60 p-7 outline-offset-4 transition-colors duration-300 hover:border-accent/40 hover:bg-accent/[0.03] focus-visible:border-accent/40"
            >
              <h3 className="font-serif text-2xl text-balance text-fg-strong transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent md:text-3xl">
                {post.title}
              </h3>

              <p className="mt-4 text-balance text-fg-muted">{post.standfirst}</p>

              {/* What is inside it. Six named parts say more than "read more" does. */}
              <p className="mt-6 font-mono text-[0.6875rem] leading-relaxed text-fg-faint">
                {post.parts.map((part) => part.title).join(" · ")}
              </p>

              {/* `mt-auto`: cards in a row differ in height, and the affordance belongs at
                  the bottom edge of the card rather than under its own text. */}
              <span className="mt-auto pt-7 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
                Read →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
