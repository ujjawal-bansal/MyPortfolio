import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectConstellation } from "@/components/three/ProjectConstellation";
import { ArchitectureDiagram } from "@/components/ui/ArchitectureDiagram";
import { architectures, diagramLegend } from "@/content/architecture";
import { arcSteps } from "@/content/caseStudyArc";
import { projectBySlug, projects, type CaseStudy } from "@/content/projects";
import { site } from "@/content/site";
import { isPending } from "@/content/types";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const title = `${project.name} — ${project.tagline}`;
  return {
    title: project.name,
    description: project.summary,
    openGraph: {
      type: "article",
      title,
      description: project.summary,
      url: `/work/${project.slug}`,
    },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const architecture = architectures[project.slug];

  return (
    <>
      {/* This project's own system, faint, behind its story. Not the home page's scene. */}
      {architecture ? <ProjectConstellation architecture={architecture} /> : null}
      <main id="main-content" className="relative z-10 flex-1">
        <article>
          {/* ---- Masthead ---- */}
          <header className="mx-auto w-full max-w-wide gutter pt-28 pb-14 md:pt-36 md:pb-20">
            <Link
              href="/#projects"
              className="font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors hover:text-accent"
            >
              ← All work
            </Link>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-3">
              <h1 className="font-serif text-5xl font-light tracking-tight text-fg-strong md:text-6xl">
                {project.name}
              </h1>
              {project.status === "live" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest/50 px-2.5 py-0.5 font-mono text-[0.625rem] tracking-[0.15em] text-forest-bright uppercase">
                  <span aria-hidden className="size-1.5 rounded-full bg-forest-bright" />
                  Live in production
                </span>
              ) : null}
            </div>

            <p className="mt-4 font-mono text-sm tracking-wide text-fg-muted">{project.tagline}</p>

            {!isPending(project.deployment) ? (
              <p className="mt-6 text-lg text-fg">{project.deployment}</p>
            ) : null}

            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
              {project.stack.map((group) => (
                <div key={group.group}>
                  <p className="font-mono text-[0.625rem] tracking-[0.2em] text-fg-ghost uppercase">
                    {group.group}
                  </p>
                  <p className="mt-1.5 text-sm text-fg-muted">{group.items.join(" · ")}</p>
                </div>
              ))}
            </div>

            <ProjectLinks project={project} />
          </header>

          {/* ---- The arc ---- */}
          <div className="mx-auto w-full max-w-wide gutter pb-24">
            {arcSteps.map((step, index) => (
              <section
                key={step.key}
                id={step.id}
                className="grid scroll-mt-16 grid-cols-1 gap-x-12 border-t border-line/60 py-12 md:grid-cols-[14rem_minmax(0,1fr)] md:py-16"
              >
                <h2 className="mb-5 md:mb-0">
                  <span className="mr-3 font-mono text-xs text-fg-ghost tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                    {step.label}
                  </span>
                </h2>

                <div>
                  <p
                    className={cn(
                      "text-balance measure",
                      // The question is the pivot of the whole page; it gets to be loud.
                      step.key === "question"
                        ? "font-serif text-2xl text-fg-strong italic md:text-3xl"
                        : "text-lg leading-relaxed text-fg",
                    )}
                  >
                    {project.arc[step.key]}
                  </p>

                  {step.key === "system" && architecture ? (
                    <figure className="mt-10">
                      <div className="relative">
                        <div className="overflow-x-auto rounded-lg border border-line/60 bg-bg-raised p-5 md:p-8">
                          <ArchitectureDiagram architecture={architecture} className="min-w-[36rem]" />
                        </div>
                        {/*
                        The diagram is wider than a phone, so the panel scrolls. Without an
                        edge fade nothing suggests that, and the right-hand third of the
                        architecture simply goes unseen.
                      */}
                        <div
                          aria-hidden
                          className="pointer-events-none absolute inset-y-px right-px w-12 rounded-r-lg bg-gradient-to-l from-bg-raised to-transparent md:hidden"
                        />
                      </div>
                      <p className="mt-2 font-mono text-[0.625rem] tracking-wide text-fg-ghost md:hidden">
                        scroll the diagram sideways →
                      </p>
                      <figcaption className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                        {diagramLegend.map((entry) => (
                          <span
                            key={entry.kind}
                            className="flex items-center gap-2 font-mono text-[0.625rem] tracking-wide text-fg-faint uppercase"
                          >
                            <span
                              aria-hidden
                              className={cn("size-2 rounded-sm border", {
                                "border-parchment-dim": entry.kind === "client",
                                "border-amber": entry.kind === "service",
                                "border-blue-bright": entry.kind === "gate",
                                "border-forest-bright": entry.kind === "data",
                                "border-brown": entry.kind === "external",
                              })}
                            />
                            {entry.label}
                          </span>
                        ))}
                        <span className="font-mono text-[0.625rem] text-fg-ghost">dashed = on a timer</span>
                      </figcaption>
                    </figure>
                  ) : null}

                  {step.key === "result" && project.notes.length > 0 ? (
                    <dl className="mt-10 space-y-6">
                      {project.notes.map((note) => (
                        <div key={note.label} className="border-l-2 border-line/50 pl-5">
                          <dt className="font-mono text-xs tracking-wide text-fg-strong">{note.label}</dt>
                          <dd className="mt-2 text-sm leading-relaxed text-fg-muted measure">{note.body}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </div>
              </section>
            ))}
          </div>

          <NextProject slug={project.slug} />
        </article>
      </main>
    </>
  );
}

function ProjectLinks({ project }: { project: CaseStudy }) {
  const resolved = project.links.filter((link) => !isPending(link.href));
  const missing = project.links.filter((link) => isPending(link.href));

  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
      {resolved.map((link) => (
        <a
          key={link.label}
          href={isPending(link.href) ? undefined : link.href}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-fg-strong transition-colors hover:border-accent/50 hover:text-accent"
        >
          {link.label} ↗
        </a>
      ))}

      {/*
        facts.md has the GitHub profile but not the per-repository URLs. Linking the
        profile is honest; inventing a repository slug would not be.
      */}
      {missing.length > 0 && !isPending(site.links.github.href) ? (
        <a
          href={site.links.github.href}
          target="_blank"
          rel="noreferrer noopener"
          className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-accent"
        >
          GitHub ↗
        </a>
      ) : null}

      {missing.length > 0 ? (
        <span className="font-mono text-[0.6875rem] text-fg-ghost">
          {missing.map((link) => link.label.toLowerCase()).join(" and ")} not linked yet
        </span>
      ) : null}
    </div>
  );
}

function NextProject({ slug }: { slug: string }) {
  const index = projects.findIndex((project) => project.slug === slug);
  const next = projects[(index + 1) % projects.length];
  if (!next || next.slug === slug) return null;

  return (
    <nav aria-label="Next project" className="border-t border-line/60">
      <Link
        href={`/work/${next.slug}`}
        className="group mx-auto flex w-full max-w-wide flex-wrap items-baseline justify-between gap-4 gutter py-12"
      >
        <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase">Next</span>
        <span className="font-serif text-3xl text-fg-strong transition-colors group-hover:text-accent md:text-4xl">
          {next.name} →
        </span>
      </Link>
    </nav>
  );
}
