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
    description: post.pivot,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.pivot,
      url: `/writing/${post.slug}`,
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.pivot },
  };
}

/**
 * One post.
 *
 * The mirror is the post: the same question in two vocabularies with a rule between them,
 * which was the best idea in the section these came from and is the right size for an
 * essay rather than for a whole page of them. The pivot sits under it because it is the
 * sentence the two columns are both reaching for.
 */
export default async function WritingPost({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = postBySlug(slug);
  if (!post) notFound();

  const next = postAfter(post.slug);

  return (
    <main id="main-content" className="relative z-10 flex-1">
      <article>
        <header className="mx-auto w-full max-w-wide gutter pt-28 pb-8 md:pt-36 md:pb-10">
          <Link
            href="/#writing"
            className="font-mono text-[0.6875rem] tracking-[0.2em] text-fg-faint uppercase transition-colors hover:text-accent"
          >
            ← All writing
          </Link>

          <h1 className="mt-8 font-serif text-5xl font-light tracking-tight text-fg-strong md:text-6xl">
            {post.title}
          </h1>
        </header>

        <div className="mx-auto w-full max-w-wide gutter pb-24">
          {/*
            The two vocabularies, with the rule between them. It stacks on a phone, where
            a vertical rule between two columns of four words each would be absurd.
          */}
          <div className="grid gap-8 border-t border-line/60 py-12 md:grid-cols-2 md:gap-0 md:py-16">
            <div className="md:pr-12">
              <p className="font-mono text-[0.625rem] tracking-[0.2em] text-fg-ghost uppercase">
                Philosophy asks
              </p>
              <p className="mt-4 font-serif text-2xl text-balance text-fg-strong md:text-3xl">
                {post.philosophy}
              </p>
            </div>
            <div className="md:border-l md:border-line/60 md:pl-12">
              <p className="font-mono text-[0.625rem] tracking-[0.2em] text-fg-ghost uppercase">
                Engineering asks
              </p>
              <p className="mt-4 font-serif text-2xl text-balance text-fg-strong md:text-3xl">
                {post.engineering}
              </p>
            </div>
          </div>

          {/* The sentence both columns are reaching for. */}
          <p className="border-l-2 border-accent-dim/60 py-1 pl-6 font-serif text-2xl text-balance text-accent italic measure md:text-3xl">
            {post.pivot}
          </p>

          <p className="mt-12 text-lg leading-relaxed text-balance text-fg measure">{post.body}</p>

          {post.sourceId ? (
            <p className="mt-10 font-mono text-[0.6875rem] text-fg-ghost">
              Cited in docs/SOURCES.md as <span className="text-fg-faint">{post.sourceId}</span>.
            </p>
          ) : null}
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
