"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Section } from "@/components/ui/Section";
import { WritingLink } from "@/components/ui/WritingLink";
import { control, howIThink } from "@/content/howIThink";
import { stoic } from "@/content/philosophy";
import { sectionById } from "@/content/sections";
import { cn } from "@/lib/utils";

import { useMotionEffect } from "@/hooks";

/**
 * Seven verbs. Each one holds a philosophical idea and an engineering practice on the
 * same line, joined rather than merely adjacent — the claim being that they are one
 * habit, not two that happen to rhyme.
 *
 * Mobile is not the desktop grid stacked. On wide screens the pair sits either side of
 * a centre rule; on narrow ones it becomes a bracketed pair against a left spine, which
 * keeps the "these two are the same thing" reading without needing two columns.
 */
export function HowIThink() {
  const meta = sectionById("how-i-think");
  const scope = useRef<HTMLDivElement>(null);

  useMotionEffect(scope, ({ selector }) => {
    for (const row of selector("[data-habit]")) {
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: "top 80%", once: true } })
        .from(row.querySelector("[data-verb]"), {
          opacity: 0,
          x: -18,
          duration: 0.55,
          ease: "power3.out",
        })
        .from(
          row.querySelectorAll("[data-pair] > *"),
          { opacity: 0, y: 12, duration: 0.5, stagger: 0.08, ease: "power2.out" },
          "<0.1",
        )
        .from(row.querySelectorAll("[data-rule]"), { scaleX: 0, duration: 0.5, ease: "power2.inOut" }, "<");
    }
  });

  if (!meta) return null;

  return (
    <Section meta={meta}>
      <div ref={scope} className="mt-12 md:mt-16">
        {howIThink.map((habit, index) => {
          const isAccept = habit.id === control.habitId;

          return (
            <article
              key={habit.id}
              data-habit
              className="grid grid-cols-1 gap-x-10 gap-y-5 border-t border-line/50 py-10 md:grid-cols-[13rem_1fr] md:py-14"
            >
              <header data-verb className="flex items-baseline gap-4 md:block">
                <span className="font-mono text-xs text-fg-ghost tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-2xl text-accent md:mt-2 md:text-3xl">{habit.verb}</h3>
              </header>

              <div>
                <p className="font-serif text-xl text-balance text-fg-strong measure md:text-2xl">
                  {habit.line}
                </p>

                {/* The pair. Two halves of one sentence, facing each other. */}
                <div
                  data-pair
                  className={cn(
                    "mt-7 grid gap-x-8 gap-y-4",
                    "border-l border-line/60 pl-5",
                    "md:grid-cols-[1fr_auto_1fr] md:items-center md:border-l-0 md:pl-0",
                  )}
                >
                  <p className="font-serif text-lg text-fg-muted italic md:text-right">{habit.philosophy}</p>
                  <span
                    aria-hidden
                    data-rule
                    className="hidden h-px w-10 origin-center bg-line-strong md:block"
                  />
                  <p className="font-mono text-sm leading-relaxed tracking-tight text-fg">
                    {habit.engineering}
                  </p>
                </div>

                <p className="mt-7 leading-relaxed text-fg-muted measure">{habit.body}</p>

                {habit.inPractice ? (
                  <p className="mt-5 border-l-2 border-accent-dim/40 py-1 pl-4 text-sm text-fg-faint measure">
                    {habit.inPractice}
                  </p>
                ) : null}

                {/* The dichotomy of control lives inside ACCEPT, not in a box of its own. */}
                {isAccept ? (
                  <div className="mt-8 grid gap-6 sm:grid-cols-2">
                    {[control.yours, control.theirs].map((column, columnIndex) => (
                      <div key={column.label}>
                        <p
                          className={cn(
                            "font-mono text-[0.625rem] tracking-[0.2em] uppercase",
                            columnIndex === 0 ? "text-forest-bright" : "text-fg-ghost",
                          )}
                        >
                          {column.label}
                        </p>
                        <ul className="mt-3 space-y-1.5">
                          {column.items.map((item) => (
                            <li
                              key={item}
                              className={cn(
                                "text-sm",
                                columnIndex === 0 ? "text-fg" : "text-fg-faint line-through decoration-1",
                              )}
                            >
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    <figure className="sm:col-span-2">
                      <blockquote className="font-serif text-base text-balance text-fg-muted italic measure">
                        &ldquo;{stoic.translation}&rdquo;
                      </blockquote>
                      <figcaption className="mt-2 font-mono text-[0.625rem] tracking-wide text-fg-ghost">
                        {stoic.citation.text}, {stoic.citation.location}
                      </figcaption>
                    </figure>
                  </div>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>

      {/* The same thinking at length. This is the sentence the writing finishes. */}
      <WritingLink className="mt-16 md:mt-20" />
    </Section>
  );
}
