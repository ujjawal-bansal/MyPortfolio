import Link from "next/link";
import { Middots } from "@/components/ui/Middots";
import type { Post } from "@/content/writing";

/**
 * One post, as a card.
 *
 * It leads with the standfirst and then names its parts, because the parts are the
 * argument for reading it — a card showing only a title would undersell the post it
 * points at. A post with a single part names nothing, since "one part" is not a pitch.
 */
export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/writing/${post.slug}`}
      className="group flex h-full flex-col rounded-sm border border-line/60 p-7 outline-offset-4 transition-colors duration-300 hover:border-accent/40 hover:bg-accent/[0.03] focus-visible:border-accent/40"
    >
      <h2 className="font-serif text-2xl text-balance text-fg-strong transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent md:text-3xl">
        {post.title}
      </h2>

      <p className="mt-4 text-balance text-fg-muted">{post.standfirst}</p>

      {post.parts.length > 1 ? (
        <p className="mt-6 font-mono text-[0.6875rem] leading-relaxed text-fg-faint">
          <Middots items={post.parts.map((part) => part.title)} />
        </p>
      ) : null}

      {/* `mt-auto`: cards in a row differ in height, and the affordance belongs at the
          bottom edge of the card rather than under its own text. */}
      <span className="mt-auto pt-7 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
        Read →
      </span>
    </Link>
  );
}
