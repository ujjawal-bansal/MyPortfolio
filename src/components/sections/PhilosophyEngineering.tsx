"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Section } from "@/components/ui/Section";
import { answer, pairings } from "@/content/philosophyEngineering";
import { sectionById } from "@/content/sections";
import { useMotionEffect } from "@/hooks";

/**
 * The mirror.
 *
 * Each pairing is one question asked twice — once in philosophy, once in code — with a
 * rule down the middle. On wide screens the halves genuinely mirror: the philosophy side
 * is right-aligned so it presses against the divider, the engineering side left-aligned
 * so it presses back. They meet at the pivot line, which is the sentence worth taking away.
 *
 * On narrow screens the mirror rotates rather than collapsing. The rule becomes
 * horizontal, philosophy sits above it right-aligned and engineering below it
 * left-aligned, so the two still face each other across a boundary. Stacking them
 * left-aligned would have thrown away the whole idea.
 *
 * The code is real — each snippet is the shape of something in docs/facts.md, so the
 * mirror survives a reader who looks closely at it.
 */
export function PhilosophyEngineering() {
  const meta = sectionById("philosophy-engineering");
  const scope = useRef<HTMLDivElement>(null);

  useMotionEffect(scope, ({ selector }) => {
    for (const row of selector("[data-pairing]")) {
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: "top 78%", once: true } })
        // The halves arrive from their own sides — the motion is the mirror too.
        .from(row.querySelectorAll("[data-side='philosophy']"), {
          opacity: 0,
          x: -26,
          duration: 0.65,
          ease: "power3.out",
        })
        .from(
          row.querySelectorAll("[data-side='engineering']"),
          { opacity: 0, x: 26, duration: 0.65, ease: "power3.out" },
          "<",
        )
        .from(
          row.querySelectorAll("[data-divider]"),
          { scaleY: 0, scaleX: 0, duration: 0.6, ease: "power2.inOut" },
          "<0.1",
        )
        .from(
          row.querySelectorAll("[data-pivot]"),
          { opacity: 0, y: 10, duration: 0.5, ease: "power2.out" },
          "-=0.25",
        );
    }
  });

  if (!meta) return null;

  return (
    <Section meta={meta}>
      <p className="mt-6 text-lg text-balance text-fg-muted measure">{answer}</p>

      <div ref={scope} className="mt-16 space-y-20 md:mt-24 md:space-y-28">
        {pairings.map((pairing) => (
          <article key={pairing.id} data-pairing>
            <h3 className="mb-8 text-center font-mono text-[0.625rem] tracking-[0.25em] text-fg-faint uppercase">
              {pairing.title}
            </h3>

            {/* The two questions, facing each other across the rule. */}
            <div className="grid items-center gap-5 md:grid-cols-[1fr_auto_1fr] md:gap-10">
              <p
                data-side="philosophy"
                className="text-right font-serif text-xl text-balance text-fg-strong italic md:text-2xl"
              >
                {pairing.philosophy}
              </p>

              <span
                aria-hidden
                data-divider
                className="h-px w-full origin-center bg-line-strong md:h-24 md:w-px"
              />

              <p
                data-side="engineering"
                className="font-serif text-xl text-balance text-fg-strong md:text-2xl"
              >
                {pairing.engineering}
              </p>
            </div>

            {/* The pivot sits on the axis, crossing the divider. */}
            <p
              data-pivot
              className="mt-8 text-center font-serif text-lg text-balance text-accent md:mt-10 md:text-xl"
            >
              {pairing.pivot}
            </p>

            {/* Prose and code mirror the same arrangement one level down. */}
            <div className="mt-10 grid gap-6 md:grid-cols-[1fr_auto_1fr] md:gap-10">
              <p data-side="philosophy" className="text-sm leading-relaxed text-fg-muted md:text-right">
                {pairing.body}
              </p>

              <span aria-hidden className="hidden md:block md:w-px" />

              <pre
                data-side="engineering"
                className="overflow-x-auto rounded-md border border-line/60 bg-bg-raised/40 p-4 font-mono text-xs leading-relaxed"
              >
                <code>
                  {pairing.code.lines.map((line) => (
                    <span
                      key={line}
                      className={
                        // Comments carry the philosophical half of the snippet, so they
                        // are the part worth reading, not the part to grey out.
                        line.trimStart().startsWith("//") ||
                        line.trimStart().startsWith("--") ||
                        line.trimStart().startsWith("#")
                          ? "block text-fg-faint"
                          : "block text-forest-bright"
                      }
                    >
                      {line}
                    </span>
                  ))}
                </code>
              </pre>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
