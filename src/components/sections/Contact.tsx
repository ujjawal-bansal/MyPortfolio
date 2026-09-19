import { ComingInPhase, Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { site } from "@/content/site";
import { isPending } from "@/content/types";

export function Contact() {
  const meta = sectionById("contact");
  if (!meta) return null;

  const links = Object.values(site.links).filter((link) => !isPending(link.href));
  const resumeReady = !isPending(site.resume.href);

  return (
    <Section meta={meta}>
      <ul className="mt-10 space-y-px">
        {links.map((link) => (
          <li key={link.label} className="border-t border-line/60">
            <a
              href={isPending(link.href) ? undefined : link.href}
              {...(link.external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
              className="group flex flex-wrap items-baseline gap-x-6 py-5"
            >
              <span className="w-20 shrink-0 font-mono text-xs tracking-[0.2em] text-fg-faint uppercase">
                {link.label}
              </span>
              <span className="font-serif text-lg text-fg-strong transition-colors duration-200 group-hover:text-accent">
                {isPending(link.display) || !link.display ? link.href : link.display}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {resumeReady ? null : (
        <ComingInPhase phase={7} note="résumé link — the PDF path is still unset in site.ts" />
      )}
    </Section>
  );
}
