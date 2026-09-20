import { Fragments } from "@/components/three/Fragments";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { site } from "@/content/site";
import { sectionById } from "@/content/sections";

/**
 * The hero. Not "Hi, I'm Ujjawal, a full-stack developer" (BRIEF §17).
 *
 * The Sanskrit line is deliberately unexplained. It used to resolve further down the
 * page; that section is gone, so it now stands as atmosphere only. Its translation and
 * source are still in docs/SOURCES.md and `philosophy.ts` if it should ever resolve
 * somewhere again.
 */
export function Hero() {
  const meta = sectionById("hero");
  if (!meta) return null;

  return (
    <section
      id={meta.id}
      aria-labelledby="hero-heading"
      // The hero sits outside <main>, so it needs its own Neti Neti marker — without
      // one it survives the removal and "everything else" is a lie.
      data-neti-layer="words"
      className="relative z-10 flex min-h-svh flex-col justify-center overflow-x-clip"
    >
      <Fragments />

      <div className="relative mx-auto w-full max-w-wide gutter">
        <div className="space-y-2 measure">
          {site.hero.lines.map((line) => (
            <p key={line} className="font-serif text-xl font-light text-balance text-fg-muted md:text-2xl">
              {line}
            </p>
          ))}
        </div>

        <h1 id="hero-heading" className="group/name mt-10 grid place-items-start">
          {/*
            One name, two scripts. Both are always in the DOM and share a single grid
            cell, so the swap happens exactly in place and the box never resizes.

            The Latin is the accessible name: the Devanagari is aria-hidden and a
            screen-reader-only copy carries the text, so assistive tech hears
            "Ujjawal Bansal" once rather than a heading that changes under it.

            Both carry an explicit leading, because the base stylesheet gives Devanagari
            1.9 line-height for verses — correct there, far too airy for a 72px heading.
          */}
          <span className="sr-only">{site.hero.name}</span>

          <span
            aria-hidden
            className="font-serif text-5xl leading-[1.15] font-light tracking-tight text-balance text-fg-strong transition-all duration-500 ease-[var(--ease-out-quart)] [grid-area:1/1] group-hover/name:-translate-y-[0.06em] group-hover/name:opacity-0 group-hover/name:blur-[3px] md:text-7xl"
          >
            {site.hero.name}
          </span>

          <span
            aria-hidden
            lang="hi"
            className="translate-y-[0.06em] text-5xl leading-[1.15] text-fg-strong opacity-0 blur-[3px] transition-all duration-500 ease-[var(--ease-out-quart)] [grid-area:1/1] group-hover/name:translate-y-0 group-hover/name:opacity-100 group-hover/name:blur-[0px] md:text-7xl"
          >
            {site.hero.devanagariName}
          </span>
        </h1>

        <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase">
          {site.hero.disciplines.join("  ·  ")}
        </p>

        {/*
          The résumé sits right beside the Sanskrit, not at the far edge. Proximity
          groups the two words as a pair; staying on the hero's single left axis keeps it
          on the reading path, where a flush-right button would float, unanchored, across
          empty space.

          Below `sm` the Sanskrit takes the full row and the button drops beneath it.
          flex-wrap alone cannot decide this: the hover gloss is absolutely positioned,
          so flex never sees its width, and inline on a phone the gloss ran past the
          screen edge and widened the page even while invisible.
        */}
        <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-6">
          <p lang="sa" className="w-full text-2xl text-accent-dim sm:w-auto md:text-3xl">
            {site.hero.whisper.devanagari}
          </p>

          <ResumeLink />
        </div>
      </div>
    </section>
  );
}
