import { Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { site } from "@/content/site";
import { isPending } from "@/content/types";

/**
 * Contact (BRIEF §27). The résumé is not here — it is offered once, in the hero, rather
 * than twice.
 *
 * Not a table. Four rows divided by rules read as a list of records, which is the one
 * thing a way of reaching a person is not. These are four points, each with the line it
 * sends out — the same grammar as the availability line and as the scene behind the page,
 * where a point reaching outward is the whole argument. Reaching for one sends the signal
 * down its ray and fires the ring; both happen on keyboard focus too, so the gesture is
 * not mouse-only.
 *
 * One column, not two. The scene converges on the middle of the viewport through this
 * section, and anything in that band gets washed out — a second column put the email
 * address straight into the cloud. Content stays left, the scene keeps the right.
 *
 * Anything facts.md has not supplied stays visibly marked rather than quietly omitted —
 * an absent link should read as "not yet" and never as "does not exist".
 */
export function Contact() {
  const meta = sectionById("contact");
  if (!meta) return null;

  const links = Object.values(site.links);

  return (
    <Section meta={meta}>
      <p className="mt-6 font-serif text-2xl text-balance text-fg-strong measure md:text-3xl">
        {site.contact.headline}
      </p>
      <p className="mt-5 text-lg text-fg-muted measure">{site.contact.body}</p>

      <ul className="mt-14">
        {links.map((link) => {
          const missing = isPending(link.href);
          const shown = link.display && !isPending(link.display) ? link.display : link.href;

          return (
            <li key={link.label}>
              {missing ? (
                <div className="flex items-center py-6">
                  <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-fg-ghost/50" />
                  <span aria-hidden className="ml-3 h-px w-10 shrink-0 bg-line/60 sm:w-14" />
                  <span className="ml-5 min-w-0">
                    <Label>{link.label}</Label>
                    <span className="mt-2 inline-block rounded border border-line px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.15em] text-fg-ghost uppercase">
                      Not added yet
                    </span>
                  </span>
                </div>
              ) : (
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group flex items-center py-6 outline-offset-4"
                >
                  {/* The point, and the ring it sends when you reach for it. */}
                  <span aria-hidden className="relative inline-flex size-1.5 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-accent opacity-0 motion-safe:group-hover:animate-signal motion-safe:group-focus-visible:animate-signal" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-accent-dim transition-colors duration-200 group-hover:bg-accent group-focus-visible:bg-accent" />
                  </span>

                  {/*
                    The ray. A fixed-width track that fills rather than a line that grows —
                    growing one would shove the address sideways every time the cursor
                    crossed it.
                  */}
                  <span
                    aria-hidden
                    className="relative ml-3 h-px w-10 shrink-0 overflow-hidden bg-line/60 sm:w-14"
                  >
                    <span className="absolute inset-y-0 left-0 w-0 bg-accent transition-[width] duration-500 ease-[var(--ease-out-quart)] group-hover:w-full group-focus-visible:w-full" />
                  </span>

                  <span className="ml-5 min-w-0">
                    <Label>{link.label}</Label>
                    {/*
                      `break-words`: an email address has no space to break at, and without
                      it the longest one widens the page past the gutter on a phone.
                    */}
                    <span className="mt-1.5 block font-serif text-xl break-words text-fg-strong transition-colors duration-200 group-hover:text-accent group-focus-visible:text-accent md:text-2xl">
                      {shown}
                    </span>
                  </span>
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-mono text-[0.625rem] tracking-[0.2em] text-fg-faint uppercase">
      {children}
    </span>
  );
}
