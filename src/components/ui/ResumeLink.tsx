import { site } from "@/content/site";
import { isPending } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * The résumé link, which changes its mind about what it is called.
 *
 * At rest it says "Résumé". On hover or focus the word turns upward and जीवनवृत्तम्
 * turns up in its place — the same document, named in the older language, with the
 * literal sense surfacing underneath.
 *
 * The word is not decoration: `vṛtta` is the past participle of √vṛt, "to turn", and
 * means *circle* as readily as it means *account of conduct*. That etymology stays in
 * docs/SOURCES.md rather than on screen — a button that explains itself in a footnote
 * is asking to be read rather than pressed.
 *
 * Accessibility: both labels are `aria-hidden` and the anchor carries a stable
 * `aria-label`, so a screen reader hears one name rather than a word that mutates.
 * Under reduced motion globals.css collapses the transition to an instant swap — still
 * a swap, just without the travel.
 */
export function ResumeLink({ className }: { className?: string }) {
  const { href } = site.resume;
  if (isPending(href)) return null;

  const { label, devanagari } = site.resumeCopy;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      className={cn(
        "group relative inline-flex rounded-lg border border-line bg-bg/70 px-5 py-3 backdrop-blur-sm transition-colors duration-300 hover:border-accent/50 focus-visible:border-accent/50",
        className,
      )}
    >
      <span className="flex items-center gap-3">
        {/* The dot, which fills as the word turns over. */}
        <span
          aria-hidden
          className="size-1.5 shrink-0 rounded-full bg-accent-dim transition-colors duration-300 group-hover:bg-accent group-focus-visible:bg-accent"
        />

        {/*
          One clipped line holding both labels. Fixed height and a min width sized for
          the Devanagari, so nothing reflows when the word changes underneath.
        */}
        <span aria-hidden className="relative block h-[2.1em] min-w-[6.5rem] overflow-hidden text-left">
          <span className="absolute inset-0 flex items-center font-mono text-xs tracking-[0.18em] text-fg-muted uppercase transition-[translate,color,opacity] duration-700 ease-[var(--ease-out-quart)] group-hover:-translate-y-full group-hover:text-accent group-hover:opacity-0 group-focus-visible:-translate-y-full group-focus-visible:opacity-0">
            {label}
          </span>
          <span
            lang="sa"
            className="absolute inset-0 flex translate-y-full items-center text-lg text-accent opacity-0 transition-[translate,opacity] duration-700 ease-[var(--ease-out-quart)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            {devanagari}
          </span>
        </span>
      </span>
    </a>
  );
}
