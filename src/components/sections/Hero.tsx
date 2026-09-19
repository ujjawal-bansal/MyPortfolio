import { Fragments } from "@/components/three/Fragments";
import { ResumeLink } from "@/components/ui/ResumeLink";
import { site } from "@/content/site";
import { sectionById } from "@/content/sections";

/**
 * The hero. Not "Hi, I'm Ujjawal, a full-stack developer" (BRIEF §17).
 *
 * The Sanskrit line is deliberately unexplained here — it resolves much later, in the
 * Shlokas section. Left as an invitation, per the brief.
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
      className="relative z-10 flex min-h-svh flex-col justify-center"
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

        <h1
          id="hero-heading"
          className="mt-10 font-serif text-5xl font-light tracking-tight text-fg-strong md:text-7xl"
        >
          {site.hero.name}
        </h1>

        <p className="mt-5 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase">
          {site.hero.disciplines.join("  ·  ")}
        </p>

        {/*
          The Sanskrit and the résumé share a line: the unexplained thing on the left,
          the entirely explicable one out to the right. They stack on narrow screens,
          where there is no room to hold both.
        */}
        <div className="mt-14 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p lang="sa" className="text-2xl text-accent-dim md:text-3xl">
            {site.hero.whisper.devanagari}
          </p>

          <ResumeLink className="self-start sm:self-auto" />
        </div>
      </div>
    </section>
  );
}
