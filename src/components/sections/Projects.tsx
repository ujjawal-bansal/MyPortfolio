import { Section } from "@/components/ui/Section";
import { projects } from "@/content/projects";
import { sectionById } from "@/content/sections";

export function Projects() {
  const meta = sectionById("projects");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <ul className="mt-12 space-y-px">
        {projects.map((project) => (
          <li key={project.slug} className="border-t border-line/60 py-8">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-serif text-2xl text-fg-strong md:text-3xl">{project.name}</h3>
              {project.status === "live" ? (
                <span className="font-mono text-[0.625rem] tracking-[0.2em] text-forest-bright uppercase">
                  In production
                </span>
              ) : null}
            </div>
            <p className="mt-2 font-mono text-xs tracking-wide text-fg-muted">{project.tagline}</p>
            <p className="mt-4 text-balance text-fg measure">{project.summary}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
