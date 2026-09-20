import { Section } from "@/components/ui/Section";
import { brandMarks, type BrandName } from "@/content/brandMarks";
import { sectionById } from "@/content/sections";
import { site } from "@/content/site";
import { isPending } from "@/content/types";

/**
 * Contact (BRIEF §27). The résumé is not here — it is offered once, in the hero, rather
 * than twice.
 *
 * Two kinds of thing, so two treatments rather than four identical rows. The address is
 * something you read and copy, so it stays a line, and it is the largest thing here. The
 * socials are places you recognise, so they are their own marks — a logo is read faster
 * than the word "LinkedIn", and three of them side by side is a row of doors rather than
 * a list of records.
 *
 * The marks keep the dot grammar: each sits inside a ring, and reaching for one lights
 * the ring and the glyph together. Every hover state is paired with `group-focus-visible`
 * so the keyboard gets the same page as the mouse.
 *
 * One column, and nothing in the middle third: the scene converges on the centre of the
 * viewport through this section, and anything parked there is washed out by the cloud.
 *
 * Anything facts.md has not supplied stays visibly marked rather than quietly omitted —
 * an absent link should read as "not yet" and never as "does not exist".
 */
const SOCIALS: readonly { key: keyof typeof site.links; mark: BrandName }[] = [
  { key: "github", mark: "github" },
  { key: "linkedin", mark: "linkedin" },
  { key: "x", mark: "x" },
];

export function Contact() {
  const meta = sectionById("contact");
  if (!meta) return null;

  const { email } = site.links;
  const address = email.display && !isPending(email.display) ? email.display : email.href;

  return (
    <Section meta={meta}>
      <p className="mt-6 font-serif text-2xl text-balance text-fg-strong measure md:text-3xl">
        {site.contact.headline}
      </p>
      <p className="mt-5 text-lg text-fg-muted measure">{site.contact.body}</p>

      {/* The one thing here that is meant to be read and copied, so it gets the size. */}
      {isPending(email.href) ? null : (
        <a href={email.href} className="group mt-14 flex items-center outline-offset-4">
          <span aria-hidden className="relative inline-flex size-1.5 shrink-0">
            <span className="absolute inset-0 rounded-full bg-accent opacity-0 motion-safe:group-hover:animate-signal motion-safe:group-focus-visible:animate-signal" />
            <span className="relative inline-flex size-1.5 rounded-full bg-accent-dim transition-colors duration-200 group-hover:bg-accent group-focus-visible:bg-accent" />
          </span>
          {/*
            A fixed-width track that fills, not a line that grows — growing one would
            shove the address sideways every time the cursor crossed it.
          */}
          <span aria-hidden className="relative ml-3 h-px w-10 shrink-0 overflow-hidden bg-line/60 sm:w-14">
            <span className="absolute inset-y-0 left-0 w-0 bg-accent transition-[width] duration-500 ease-[var(--ease-out-quart)] group-hover:w-full group-focus-visible:w-full" />
          </span>
          <span className="ml-5 min-w-0">
            <span className="block font-mono text-[0.625rem] tracking-[0.2em] text-fg-faint uppercase">
              {email.label}
            </span>
            {/* `break-words`: an address has no space to break at, and the longest one
                would otherwise widen the page past the gutter on a phone. */}
            <span className="mt-1.5 block font-serif text-xl break-words text-fg-strong transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent md:text-2xl">
              {address}
            </span>
          </span>
        </a>
      )}

      <ul className="mt-14 flex flex-wrap items-center gap-5">
        {SOCIALS.map(({ key, mark }) => {
          const link = site.links[key];
          const missing = isPending(link.href);
          const shown = link.display && !isPending(link.display) ? link.display : null;
          const glyph = brandMarks[mark];

          if (missing) {
            return (
              <li key={link.label}>
                <span
                  title={`${link.label} — not added yet`}
                  className="grid size-14 place-items-center rounded-full border border-dashed border-line/60"
                >
                  <span className="sr-only">{link.label} — not added yet</span>
                  <Glyph glyph={glyph} className="size-5 text-fg-ghost/50" />
                </span>
              </li>
            );
          }

          return (
            <li key={link.label}>
              <a
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                // The visible mark carries no text, so the handle rides in the accessible
                // name — a screen reader gets "GitHub, ujjawal-bansal", not "link".
                aria-label={shown ? `${link.label} — ${shown}` : link.label}
                className="group grid size-14 place-items-center rounded-full border border-line/70 outline-offset-4 transition-colors duration-300 hover:border-accent/50 hover:bg-accent/5 focus-visible:border-accent/50"
              >
                <Glyph
                  glyph={glyph}
                  className="size-5 text-fg-muted transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent"
                />
              </a>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

/** `fill="currentColor"` on the path, so colour stays a Tailwind text utility. */
function Glyph({ glyph, className }: { glyph: { viewBox: string; path: string }; className: string }) {
  return (
    <svg aria-hidden viewBox={glyph.viewBox} className={className} fill="currentColor">
      <path d={glyph.path} />
    </svg>
  );
}
