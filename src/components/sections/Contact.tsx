import { Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { site } from "@/content/site";
import { isPending } from "@/content/types";

/**
 * Contact, and the résumé beside it (BRIEF §27, §28).
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

      <ul className="mt-12">
        {links.map((link) => {
          const missing = isPending(link.href);
          const shown = link.display && !isPending(link.display) ? link.display : link.href;

          return (
            <li key={link.label} className="border-t border-line/60">
              {missing ? (
                <div className="flex flex-wrap items-baseline gap-x-6 py-5">
                  <span className="w-20 shrink-0 font-mono text-xs tracking-[0.2em] text-fg-faint uppercase">
                    {link.label}
                  </span>
                  <span className="rounded border border-line px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.15em] text-fg-ghost uppercase">
                    Not added yet
                  </span>
                </div>
              ) : (
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                  className="group flex flex-wrap items-baseline gap-x-6 py-5"
                >
                  <span className="w-20 shrink-0 font-mono text-xs tracking-[0.2em] text-fg-faint uppercase">
                    {link.label}
                  </span>
                  <span className="font-serif text-lg text-fg-strong transition-colors duration-200 group-hover:text-accent">
                    {shown}
                  </span>
                </a>
              )}
            </li>
          );
        })}
      </ul>

      <Resume />
    </Section>
  );
}

/**
 * The joke only lands if the buttons work, so when there is no PDF the section says so
 * plainly instead of offering a link to a 404.
 */
function Resume() {
  const href = site.resume.href;
  const available = !isPending(href);

  return (
    <div className="mt-20 border-t border-line/60 pt-10">
      <p className="font-serif text-xl text-balance text-fg-strong measure md:text-2xl">
        {site.resumeCopy.headline}
      </p>
      <p className="mt-3 font-mono text-xs text-fg-faint">{site.resumeCopy.note}</p>

      {available ? (
        <div className="mt-7 flex flex-wrap gap-3">
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-full border border-line px-5 py-2 font-mono text-xs tracking-[0.15em] text-fg-strong uppercase transition-colors hover:border-accent/60 hover:text-accent"
          >
            View résumé
          </a>
          <a
            href={href}
            download
            className="rounded-full border border-line px-5 py-2 font-mono text-xs tracking-[0.15em] text-fg-muted uppercase transition-colors hover:border-accent/60 hover:text-accent"
          >
            Download
          </a>
        </div>
      ) : (
        <p className="mt-7 inline-block rounded border border-line px-3 py-1.5 font-mono text-[0.625rem] tracking-[0.15em] text-fg-ghost uppercase">
          PDF not uploaded yet
        </p>
      )}
    </div>
  );
}
