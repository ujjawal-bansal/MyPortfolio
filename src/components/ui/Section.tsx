import type { SectionMeta } from "@/content/sections";
import { cn } from "@/lib/utils";

/**
 * Shared wrapper so every section agrees about rhythm, width and heading semantics.
 * Copy comes from `src/content/sections.ts`; this only arranges it.
 */
export function Section({
  meta,
  children,
  className,
  contentClassName,
  lead,
}: {
  meta: SectionMeta;
  children?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  /**
   * Rendered inside the section but before the kicker, outside the measured column.
   * Only the hero uses it: it is the opening of the Self section rather than a section
   * of its own, and it needs the full width the gutter container would deny it.
   */
  lead?: React.ReactNode;
}) {
  const headingId = `${meta.id}-heading`;

  return (
    <section
      id={meta.id}
      aria-labelledby={headingId}
      // overflow-x-clip, not hidden: GSAP parks elements at an x-offset until their
      // ScrollTrigger fires, which would otherwise widen the page. `clip` contains that
      // without creating a scroll container, so `position: sticky` still works inside.
      className={cn("relative scroll-mt-8 overflow-x-clip pt-8 pb-16 md:pt-10 md:pb-20", className)}
    >
      {lead}

      <div className={cn("mx-auto w-full max-w-wide gutter", contentClassName)}>
        {meta.kicker ? (
          <p className="mb-3 font-mono text-[0.625rem] tracking-[0.2em] text-fg-faint uppercase">
            {meta.kicker}
          </p>
        ) : null}
        <h2
          id={headingId}
          className="font-serif text-3xl font-light tracking-tight text-balance text-fg-strong md:text-4xl"
        >
          {meta.title}
        </h2>
        {children}
      </div>
    </section>
  );
}

/**
 * Marks a section as scaffolded but not yet built. Development scaffolding, not copy —
 * it names the phase that fills the section in, and disappears when that phase lands.
 */
export function ComingInPhase({ phase, note }: { phase: number; note?: string }) {
  return (
    <p className="mt-8 border-l-2 border-line py-1 pl-4 font-mono text-xs text-fg-faint">
      Phase {phase}
      {note ? `: ${note}` : null}
    </p>
  );
}
