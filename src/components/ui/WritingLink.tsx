import Link from "next/link";
import { posts } from "@/content/writing";
import { cn } from "@/lib/utils";

/**
 * The way to the writing.
 *
 * It sits at the end of How I think rather than in the rail, because that is the sentence
 * it finishes: this is how I think, and here is the same thinking at length. The rail is
 * for places on this page; this is a door out of it.
 *
 * Renders nothing when there is nothing to read, so an empty blog is never advertised.
 */
export function WritingLink({ className }: { className?: string }) {
  if (posts.length === 0) return null;

  return (
    <Link
      href="/writing"
      className={cn(
        "group inline-flex items-center gap-3 rounded-lg border border-line bg-bg/70 px-5 py-3.5 backdrop-blur-sm transition-colors duration-300 hover:border-accent/50 focus-visible:border-accent/50",
        className,
      )}
    >
      <span
        aria-hidden
        className="size-1.5 shrink-0 rounded-full bg-accent-dim transition-colors duration-300 group-hover:bg-accent group-focus-visible:bg-accent"
      />
      <span className="font-mono text-xs tracking-[0.18em] text-fg-muted uppercase transition-colors duration-300 group-hover:text-accent group-focus-visible:text-accent">
        Writing
      </span>
      <span
        aria-hidden
        className="font-mono text-xs text-fg-faint transition-[translate,color] duration-300 group-hover:translate-x-1 group-hover:text-accent group-focus-visible:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
