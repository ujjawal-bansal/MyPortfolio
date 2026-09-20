import { Availability } from "@/components/ui/Availability";
import { site } from "@/content/site";

/**
 * The colophon, and nothing else.
 *
 * The rule is full-bleed, on the `<footer>` itself rather than inside the gutter. That is
 * the opposite of what mid-page rules do, and deliberately: a rule that divides content
 * belongs in the content column, but this one is the page's bottom edge. Running it wall
 * to wall makes it read as structure rather than as one more divider.
 *
 * Thin on purpose. It frames a single 12px line, so the padding is sized for a colophon
 * bar — roughly 64px tall — not for a section.
 *
 * The name sits on the left axis the rest of the site uses; the availability signal is
 * flush to the opposite edge and on the same baseline, so the two ends of the row are the
 * two ends of the rule above it.
 */
export function Footer() {
  return (
    <footer data-neti-layer="interface" className="relative z-10 border-t border-line/60">
      <div className="mx-auto flex w-full max-w-wide flex-wrap items-baseline justify-between gap-x-8 gap-y-3 gutter py-5 md:py-6">
        <p className="font-mono text-xs text-fg-ghost">
          {site.name} · {new Date().getFullYear()}
        </p>
        <Availability />
      </div>
    </footer>
  );
}
