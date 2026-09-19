import type { Snippet } from "@/content/projects";
import { highlight } from "@/lib/highlight";

/**
 * A highlighted snippet. Async server component: shiki runs at build time and the
 * browser gets pre-coloured markup, so syntax highlighting costs zero client JavaScript.
 *
 * Always labelled "simplified" — these snippets are trimmed to the shape of the
 * decision, and saying so is the difference between an illustration and a claim.
 */
export async function CodeBlock({ snippet }: { snippet: Snippet }) {
  const html = await highlight(snippet.code, snippet.language);

  return (
    <figure className="mt-8">
      <div className="overflow-hidden rounded-lg border border-line bg-bg-raised">
        <div className="flex items-center justify-between border-b border-line/70 px-4 py-2.5">
          <span className="font-mono text-[0.6875rem] tracking-wide text-fg-faint">{snippet.title}</span>
          <span className="rounded border border-line px-2 py-0.5 font-mono text-[0.625rem] tracking-[0.15em] text-fg-ghost uppercase">
            simplified
          </span>
        </div>
        {/*
          shiki emits <pre class="shiki">; the padding and scroll behaviour are ours.
          The HTML comes from our own content file, highlighted at build time.
        */}
        <div
          className="[&_code]:font-mono [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:font-mono [&_pre]:text-xs [&_pre]:leading-relaxed"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      <figcaption className="mt-3 text-sm text-balance text-fg-muted measure">{snippet.caption}</figcaption>
    </figure>
  );
}
