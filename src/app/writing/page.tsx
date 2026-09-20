import type { Metadata } from "next";
import Link from "next/link";
import { PostCard } from "@/components/ui/PostCard";
import { posts } from "@/content/writing";

export const metadata: Metadata = {
  title: "Writing",
  description: "Longer form: one question at a time, asked in two vocabularies.",
  openGraph: {
    title: "Writing",
    description: "Longer form: one question at a time, asked in two vocabularies.",
    url: "/writing",
  },
};

/**
 * The index. Its own page rather than a band on the home page: the writing is a place you
 * go, reached by a door at the end of How I think, not another thing to scroll past.
 *
 * One card per post, two columns. With a single post the card sits in the left column
 * rather than stretching across the row — the site holds content to a left measure
 * everywhere, and a lone full-width card would be the one banner on the site. The second
 * post fills the gap with no layout change.
 */
export default function WritingIndex() {
  return (
    <main id="main-content" className="relative z-10 flex-1">
      <div className="mx-auto w-full max-w-wide gutter pt-28 pb-24 md:pt-36">
        <Link
          href="/"
          className="-my-2 inline-block py-2 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors hover:text-accent"
        >
          ← Back
        </Link>

        <p className="mt-10 mb-3 font-mono text-[0.625rem] tracking-[0.2em] text-fg-faint uppercase">
          Longer form
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-balance text-fg-strong md:text-5xl">
          Things worth writing down
        </h1>

        <ul className="mt-14 grid gap-5 sm:grid-cols-2">
          {posts.map((post) => (
            <li key={post.slug}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
