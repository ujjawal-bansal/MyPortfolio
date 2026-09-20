import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectConstellation } from "@/components/three/ProjectConstellation";
import { ArchitectureDiagram } from "@/components/ui/ArchitectureDiagram";
import { architectures, diagramLegend, type Architecture } from "@/content/architecture";
import { caseStudySections } from "@/content/caseStudySections";
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
  const { story } = project;

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
              className="-my-2 inline-block py-2 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors hover:text-accent"
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

          {/* ---- Four sections, each short on purpose ---- */}
          <div className="mx-auto w-full max-w-wide gutter pb-24">
            {caseStudySections.map((section, index) => (
              <section
                key={section.id}
                id={section.id}
                className="grid scroll-mt-16 grid-cols-1 gap-x-12 border-t border-line/60 py-12 md:grid-cols-[14rem_minmax(0,1fr)] md:py-16"
              >
                <h2 className="mb-5 md:mb-0">
                  <span className="mr-3 font-mono text-xs text-fg-ghost tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
                    {section.label}
                  </span>
                </h2>

                <div>
                  {section.id === "problem" ? (
                    <>
                      <p className={prose}>{story.problem}</p>
                      {/* The problem at its sharpest. It gets to be loud. */}
                      <p className="mt-8 font-serif text-2xl text-balance text-fg-strong italic measure md:text-3xl">
                        {story.question}
                      </p>
                    </>
                  ) : null}

                  {section.id === "solution" ? (
                    <>
                      <p className={prose}>{story.solution}</p>
                      {/* The outcome, marked with the dot — one line, scannable. */}
                      <p className="mt-6 flex items-baseline gap-3 text-fg-strong measure">
                        <span
                          aria-hidden
                          className="size-1.5 shrink-0 translate-y-[-0.15em] rounded-full bg-accent"
                        />
                        {story.result}
                      </p>
                    </>
                  ) : null}

                  {section.id === "architecture" ? (
                    <>
                      <p className={prose}>{story.architecture}</p>
                      {architecture ? <SystemDiagram architecture={architecture} /> : null}
                    </>
                  ) : null}

                  {section.id === "technical-depth" ? (
                    <>
                      {/* Three or four one-liners. Each is a fact or a decision, never both. */}
                      <ul className="space-y-4">
                        {story.depth.map((line) => (
                          <li
                            key={line}
                            className="flex items-baseline gap-4 text-lg leading-relaxed text-fg measure"
                          >
                            <span
                              aria-hidden
                              className="size-1.5 shrink-0 translate-y-[-0.2em] rounded-full bg-accent-dim"
                            />
                            {line}
                          </li>
                        ))}
                      </ul>

                      {/*
                        The lesson the page closes on. The constellation behind the page
                        gathers back into a single point as it comes into view.
                      */}
                      <blockquote
                        id="takeaway"
                        className="mt-14 border-l-2 border-accent-dim/60 pl-6 font-serif text-xl text-balance text-fg-strong italic measure md:text-2xl"
                      >
                        {story.takeaway}
                      </blockquote>
                    </>
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

/** Body copy for a case study. One place, so every section reads at the same size. */
const prose = "text-lg leading-relaxed text-balance text-fg measure";

function SystemDiagram({ architecture }: { architecture: Architecture }) {
  return (
    <figure className="mt-10">
      <div className="relative">
        <div className="overflow-x-auto rounded-lg border border-line/60 bg-bg-raised p-5 md:p-8">
          <ArchitectureDiagram architecture={architecture} className="min-w-[36rem]" />
        </div>
        {/*
          The diagram is wider than a phone, so the panel scrolls. Without an edge fade
          nothing suggests that, and the right-hand third of the architecture goes unseen.
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
