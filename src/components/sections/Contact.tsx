import { Section } from "@/components/ui/Section";
import { brandMarks, type BrandName } from "@/content/brandMarks";
import { sectionById } from "@/content/sections";
import { site } from "@/content/site";
import { isPending } from "@/content/types";

/**
 * Contact (BRIEF §27). The résumé is not here — it is offered once, in the hero, rather
 * than twice.
 *
 * Four marks rather than four rows: a logo is recognised faster than the word next to it,
 * and a row of them reads as a row of doors instead of a list of records. Each sits in a
 * ring — the dot grammar the rest of the site is built from — and reaching for one lights
 * the ring and the glyph together. Every hover state is paired with `group-focus-visible`
 * so the keyboard gets the same page as the mouse.
 *
 * Mail leads, and the address is written out underneath it: an address is the one thing
 * here meant to be read and copied, and an envelope alone cannot be copied. The marks
 * carry no visible text, so each handle rides in the `aria-label`.
 *
 * Nothing sits in the middle third — the scene converges on the centre of the viewport
 * through this section, and anything parked there is washed out by the cloud.
 *
 * Anything facts.md has not supplied stays visibly marked rather than quietly omitted —
 * an absent link should read as "not yet" and never as "does not exist".
 */
const CHANNELS: readonly { key: keyof typeof site.links; mark: BrandName }[] = [
  { key: "email", mark: "mail" },
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

      <ul className="mt-10 flex flex-wrap items-center gap-5">
        {CHANNELS.map(({ key, mark }) => {
          const link = site.links[key];
          const glyph = brandMarks[mark];
          const shown = link.display && !isPending(link.display) ? link.display : null;

          if (isPending(link.href)) {
            return (
              <li key={link.label}>
                <span className="grid size-14 place-items-center rounded-full border border-dashed border-line/60">
                  <span className="sr-only">{link.label}: not added yet</span>
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
                // The mark carries no text, so the handle rides in the accessible name —
                // a screen reader gets "GitHub, ujjawal-bansal", not "link".
                aria-label={shown ? `${link.label}: ${shown}` : link.label}
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

      {/*
        Written out, because an envelope cannot be copied and this is the one thing on the
        page someone needs to keep. `break-words`: an address has no space to break at, and
        the longest one would otherwise widen the page past the gutter on a phone.
      */}
      {isPending(email.href) ? null : (
        <a
          href={email.href}
          className="mt-8 inline-block font-serif text-xl break-words text-fg-strong underline decoration-fg-faint decoration-1 underline-offset-[6px] outline-offset-4 transition-colors duration-200 hover:text-accent hover:decoration-accent focus-visible:text-accent focus-visible:decoration-accent md:text-2xl"
        >
          {address}
        </a>
      )}
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
