import Link from "next/link";
import { ArchitectureDiagram } from "@/components/ui/ArchitectureDiagram";
import { Section } from "@/components/ui/Section";
import { architectures } from "@/content/architecture";
import { projects } from "@/content/projects";
import { sectionById } from "@/content/sections";

/**
 * Not cards. Each project is a full-width entry point whose only ornament is its own
 * architecture, reduced to points and lines — the dot becoming a system, one per
 * project, drawn in as you reach it.
 *
 * The whole row is the link. A "view case study →" affordance would be a card tell.
 */
export function Projects() {
  const meta = sectionById("projects");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <ul className="mt-14 md:mt-20">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              className="group grid grid-cols-1 items-center gap-6 border-t border-line/60 py-10 md:grid-cols-[1fr_16rem] md:gap-14 md:py-14"
            >
              <div>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                  <span className="font-mono text-xs text-fg-ghost tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif text-3xl text-fg-strong transition-colors duration-300 group-hover:text-accent md:text-4xl">
                    {project.name}
                  </h3>
                  {project.status === "live" ? <LiveMarker /> : null}
                </div>

                <p className="mt-3 font-mono text-xs tracking-wide text-fg-muted">{project.tagline}</p>
                <p className="mt-5 text-balance text-fg measure">{project.summary}</p>

                <p className="mt-6 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors duration-300 group-hover:text-accent">
                  Read the case study
                </p>
              </div>

              <ArchitectureDiagram
                architecture={architectures[project.slug]}
                variant="mini"
                className="order-first opacity-70 transition-opacity duration-500 group-hover:opacity-100 md:order-none"
              />
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** Only QueueLite earns this, and only because facts.md says where and how many. */
function LiveMarker() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/50 px-2.5 py-0.5 font-mono text-[0.625rem] tracking-[0.15em] text-forest-bright uppercase">
      <span aria-hidden className="size-1.5 rounded-full bg-forest-bright" />
      Live in production
    </span>
  );
}
