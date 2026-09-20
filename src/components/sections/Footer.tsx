import { Availability } from "@/components/ui/Availability";
import { site } from "@/content/site";

/**
 * The colophon, and nothing else.
 *
 * It used to carry the Thought → Action → Experience → Thought loop and two closing
 * lines. Those are gone, and with them the reason this was a client component — the only
 * animation in here staggered the loop's four words, so the footer is server-rendered now.
 *
 * One row: the name and year on the left axis the rest of the site uses, the availability
 * signal flush to the opposite edge and on the same baseline. No inner hairline, because
 * the footer's own top border is already the only separation a single row needs.
 */
export function Footer() {
  return (
    <footer data-neti-layer="interface" className="relative z-10">
      {/*
        The rule sits inside the gutter, not on the <footer>. On the element it ran the
        full viewport — 1440px against the 1136px every other rule on this site spans —
        so the page ended on the one line wider than everything above it.
      */}
      <div className="mx-auto w-full max-w-wide gutter">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-line/60 py-10 md:py-12">
          <p className="font-mono text-xs text-fg-ghost">
            {site.name} · {new Date().getFullYear()}
          </p>
          <Availability />
        </div>
      </div>
    </footer>
  );
}
