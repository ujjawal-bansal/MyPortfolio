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
      className="relative flex min-h-svh flex-col justify-center"
    >
      {/* Phase 3 mounts The Dot here, behind the type. */}
      <div aria-hidden className="pointer-events-none absolute inset-0" data-slot="hero-canvas" />

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

        <p lang="sa" className="mt-14 text-2xl text-accent-dim md:text-3xl" title={undefined}>
          {site.hero.whisper.devanagari}
        </p>
      </div>
    </section>
  );
}
