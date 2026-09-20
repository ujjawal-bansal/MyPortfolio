"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Section } from "@/components/ui/Section";
import { journey, journeyNote } from "@/content/journey";
import { sectionById } from "@/content/sections";
import { isPending } from "@/content/types";
import { useMotionEffect } from "@/hooks";
import { cn } from "@/lib/utils";

/**
 * The timeline. Every entry comes from `journey.ts`, which comes from facts.md — nothing
 * is inferred and no gap is filled. A date facts.md does not state renders visibly blank.
 *
 * The spine is the motif again: a line of points, drawn top to bottom as you scroll.
 */
export function Journey() {
  const meta = sectionById("journey");
  const scope = useRef<HTMLDivElement>(null);

  useMotionEffect(scope, ({ selector }) => {
    const spine = selector("[data-spine]")[0];
    if (spine) {
      gsap.from(spine, {
        scrollTrigger: { trigger: spine, start: "top 80%", end: "bottom 60%", scrub: 0.6 },
        scaleY: 0,
        transformOrigin: "top center",
        ease: "none",
      });
    }

    for (const row of selector("[data-milestone]")) {
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: "top 85%", once: true } })
        .from(row.querySelector("[data-point]"), {
          scale: 0,
          opacity: 0,
          duration: 0.45,
          ease: "back.out(2)",
        })
        .from(
          row.querySelector("[data-body]"),
          { opacity: 0, x: 14, duration: 0.5, ease: "power2.out" },
          "<0.1",
        );
    }
  });

  if (!meta) return null;

  return (
    <Section meta={meta}>
      <div ref={scope} className="relative mt-8 md:mt-10">
        {/* The spine, behind the points. */}
        <span
          aria-hidden
          data-spine
          className="absolute top-2 bottom-2 left-[5px] w-px bg-line-strong md:left-[calc(9rem+5px)]"
        />

        <ol className="space-y-7 md:space-y-8">
          {journey.map((milestone) => (
            <li
              key={milestone.id}
              data-milestone
              className={cn("relative grid grid-cols-1 gap-x-8 pl-8 md:grid-cols-[9rem_1fr] md:pl-0")}
            >
              <p className="font-mono text-xs tracking-[0.15em] text-balance text-fg-faint uppercase md:text-right">
                {/* A date facts.md does not give is left visibly blank, never guessed. */}
                {isPending(milestone.when) ? <span className="text-fg-ghost">date tbc</span> : milestone.when}
              </p>

              <span
                aria-hidden
                data-point
                className={cn(
                  "absolute top-1.5 left-0 size-2.5 rounded-full md:left-[9rem]",
                  milestone.future ? "border border-accent-dim bg-transparent" : "bg-accent",
                )}
                style={milestone.future ? undefined : { boxShadow: "0 0 10px var(--dot-glow)" }}
              />

              <div data-body className="mt-2 md:mt-0 md:pl-8">
                <h3
                  className={cn(
                    "font-serif text-lg md:text-xl",
                    // Demote a future entry with colour, not opacity. Fading the whole
                    // row took its text to 2.66:1 — comfortably below WCAG AA.
                    milestone.future ? "text-fg-muted italic" : "text-fg-strong",
                  )}
                >
                  {milestone.title}
                </h3>
                {milestone.where ? <p className="mt-1 text-sm text-fg-muted">{milestone.where}</p> : null}
                {milestone.body ? (
                  <p className="mt-2 text-sm text-balance text-fg-faint measure">{milestone.body}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-12 text-sm text-balance text-fg-faint measure">{journeyNote}</p>
    </Section>
  );
}
