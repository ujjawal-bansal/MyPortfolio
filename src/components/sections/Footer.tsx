import { site } from "@/content/site";

/**
 * The dot returns to a point (BRIEF §13). Deliberately the quietest thing on the page.
 */
export function Footer() {
  return (
    <footer className="border-t border-line/60">
      <div className="mx-auto flex w-full max-w-wide flex-wrap items-center justify-between gap-4 gutter py-10">
        <p className="font-mono text-xs text-fg-faint">
          {site.name} · {new Date().getFullYear()}
        </p>
        <span aria-hidden className="size-1 rounded-full bg-accent-dim" title={undefined} />
      </div>
    </footer>
  );
}
