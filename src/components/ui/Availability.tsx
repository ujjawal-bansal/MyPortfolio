import { site } from "@/content/site";

/**
 * A single green point, slowly radiating: available.
 *
 * The site already uses this grammar — QueueLite's "Live in production" badge is a
 * forest-green dot meaning *this is true right now*. The same signal, turned on its
 * author. And a point sending something outward is the motif the whole site is built
 * from, so the status light needs no ornament of its own.
 *
 * No border, unlike the résumé link beneath it: two bordered pills in one hero would
 * compete, and a status is a statement rather than a control.
 *
 * `site.availability.open` is the switch. When it goes false this renders nothing —
 * a stale "available" is worse than no line at all.
 */
export function Availability({ className }: { className?: string }) {
  const { open, label, aside } = site.availability;
  if (!open) return null;

  return (
    <p className={className}>
      <span className="inline-flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="inline-flex items-center gap-2.5">
          {/* The dot, and the ring it sends out. */}
          <span aria-hidden className="relative inline-flex size-1.5 shrink-0">
            <span className="absolute inset-0 rounded-full bg-forest-bright opacity-0 motion-safe:animate-signal" />
            <span className="relative inline-flex size-1.5 rounded-full bg-forest-bright" />
          </span>
          <span className="font-mono text-[0.6875rem] tracking-[0.2em] text-forest-bright uppercase">
            {label}
          </span>
        </span>

        {/*
          Only while both halves share a line. Once the line wraps — narrow screens —
          a separator is left dangling at the end of the first one.
        */}
        <span aria-hidden data-separator className="hidden text-fg-ghost sm:inline">
          ·
        </span>
        <span data-aside className="font-serif text-sm text-fg-faint italic">
          {aside}
        </span>
      </span>
    </p>
  );
}
