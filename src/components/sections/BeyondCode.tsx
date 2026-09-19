import { ComingInPhase, Section } from "@/components/ui/Section";
import { categories, libraryIsPlaceholder } from "@/content/library";
import { sectionById } from "@/content/sections";

/**
 * Houses the reading archive (BRIEF §24). The shelves are real; the books are not yet —
 * `libraryIsPlaceholder` guards against rendering placeholder rows as if they were a
 * reading list.
 */
export function BeyondCode() {
  const meta = sectionById("beyond-code");
  if (!meta) return null;

  return (
    <Section meta={meta}>
      <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <li key={category.id} className="border-t border-line/60 pt-5">
            <h3 className="font-mono text-xs tracking-[0.2em] text-accent uppercase">{category.label}</h3>
            <p className="mt-2 text-sm text-balance text-fg-muted">{category.line}</p>
          </li>
        ))}
      </ul>

      {libraryIsPlaceholder ? (
        <ComingInPhase phase={6} note="the reading list itself — Ujjawal has not filled it in yet" />
      ) : null}
    </Section>
  );
}
