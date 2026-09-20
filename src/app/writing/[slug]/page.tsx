import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { postAfter, postBySlug, posts } from "@/content/writing";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.standfirst,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.standfirst,
      url: `/writing/${post.slug}`,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.standfirst },
  };
}

/**
 * One post, in parts.
 *
 * The mirror is the shape of each part: the same question in two vocabularies with a rule
 * between them. That was the best idea in the section these came from, and it is the right
 * size for a section of an essay rather than for a whole page of them. The pivot follows,
 * because it is the sentence both columns are reaching for.
 *
 * Six parts is long enough that a reader deserves to see the shape before committing, so
 * the contents list is real in-page anchors rather than decoration.
 */
export default async function WritingPost({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const next = postAfter(post.slug);

  return (
    <main id="main-content" className="relative z-10 flex-1">
      <article>
        <header className="mx-auto w-full max-w-wide gutter pt-28 pb-8 md:pt-36 md:pb-12">
          <Link
            href="/writing"
            className="-my-2 inline-block py-2 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors hover:text-accent"
          >
            ← All writing
          </Link>

          <h1 className="mt-8 font-serif text-5xl font-light tracking-tight text-balance text-fg-strong measure md:text-6xl">
            {post.title}
          </h1>

          <p className="mt-7 font-serif text-xl text-balance text-fg-muted italic measure md:text-2xl">
            {post.standfirst}
          </p>

          {/* The shape of what follows, before committing to it. */}
          {post.parts.length > 1 ? (
            <nav aria-label="Contents" className="mt-12">
              <ol className="flex flex-wrap gap-x-6 gap-y-2">
                {post.parts.map((part, index) => (
                  <li key={part.id}>
                    <a
                      href={`#${part.id}`}
                      className="font-mono text-[0.6875rem] tracking-[0.15em] text-fg-ghost uppercase transition-colors hover:text-accent focus-visible:text-accent"
                    >
                      <span className="tabular-nums">{String(index + 1).padStart(2, "0")}</span> {part.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
        </header>

        <div className="mx-auto w-full max-w-wide gutter pb-24">
          {post.parts.map((part, index) => (
            <section
              key={part.id}
              id={part.id}
              className="scroll-mt-8 border-t border-line/60 pt-12 pb-4 md:pt-16"
            >
              <h2 className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-fg-ghost tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-serif text-3xl text-fg-strong md:text-4xl">{part.title}</span>
              </h2>

              {/*
                The two vocabularies, with the rule between them. It stacks on a phone,
                where a vertical rule between two columns of four words would be absurd.
              */}
              <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-0">
                <div className="md:pr-12">
                  <p className="font-mono text-[0.625rem] tracking-[0.2em] text-fg-ghost uppercase">
                    Philosophy asks
                  </p>
                  <p className="mt-3 font-serif text-2xl text-balance text-fg-strong">{part.philosophy}</p>
                </div>
                <div className="md:border-l md:border-line/60 md:pl-12">
                  <p className="font-mono text-[0.625rem] tracking-[0.2em] text-fg-ghost uppercase">
                    Engineering asks
                  </p>
                  <p className="mt-3 font-serif text-2xl text-balance text-fg-strong">{part.engineering}</p>
                </div>
              </div>

              {/* The sentence both columns are reaching for. */}
              <p className="mt-10 border-l-2 border-accent-dim/60 py-1 pl-6 font-serif text-2xl text-balance text-accent italic measure">
                {part.pivot}
              </p>

              <p className="mt-8 text-lg leading-relaxed text-balance text-fg measure">{part.body}</p>

              {part.sourceId ? (
                <p className="mt-6 font-mono text-[0.6875rem] text-fg-ghost">
                  Cited in docs/SOURCES.md as <span className="text-fg-faint">{part.sourceId}</span>.
                </p>
              ) : null}
            </section>
          ))}
        </div>

        {next ? (
          <nav aria-label="Next post" className="border-t border-line/60">
            <Link
              href={`/writing/${next.slug}`}
              className="group mx-auto flex w-full max-w-wide flex-wrap items-baseline justify-between gap-4 gutter py-12"
            >
              <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase">
                Next
              </span>
              <span className="font-serif text-3xl text-fg-strong transition-colors group-hover:text-accent md:text-4xl">
                {next.title} →
              </span>
            </Link>
          </nav>
        ) : null}
      </article>
    </main>
  );
}
