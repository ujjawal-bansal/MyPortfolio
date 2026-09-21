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
import { DRAW, REVEAL, RISE, STAGGER, TRIGGER } from "@/lib/motion";

/**
 * Seven verbs. Each one holds a philosophical idea and an engineering practice on the
 * same line, joined rather than merely adjacent — the claim being that they are one
 * habit, not two that happen to rhyme.
 *
 * The pair is the whole argument, so the paragraph that used to sit under each verb is
 * gone. Seven of them turned a list you could take in into an essay you had to read, and
 * the verb plus its line already says it. `body` survives as optional and CREATE is the
 * only one still using it.
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
        .timeline({ scrollTrigger: { trigger: row, start: TRIGGER, once: true } })
        .from(row.querySelector("[data-verb]"), { opacity: 0, x: -RISE, ...REVEAL })
        .from(
          row.querySelectorAll("[data-pair] > *"),
          { opacity: 0, y: 12, ...REVEAL, stagger: STAGGER },
          "<0.1",
        )
        .from(row.querySelectorAll("[data-rule]"), { scaleY: 0, ...DRAW }, "<");
    }
  });

  if (!meta) return null;

  return (
    <Section meta={meta}>
      <div ref={scope} className="mt-8 md:mt-10">
        {howIThink.map((habit, index) => {
          const isAccept = habit.id === control.habitId;

          return (
            <article
              key={habit.id}
              data-habit
              className="grid grid-cols-1 gap-x-10 gap-y-4 border-t border-line/50 py-6 md:grid-cols-[13rem_1fr] md:py-8"
            >
              <header data-verb className="flex items-baseline gap-4 md:block">
                <span className="font-mono text-xs text-fg-ghost tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-serif text-2xl text-accent md:mt-2 md:text-3xl">{habit.verb}</h3>
              </header>

              <div>
                <p className="font-serif text-xl text-balance text-fg-strong md:text-2xl">{habit.line}</p>

                {/*
                  Two halves of one sentence, facing each other across a vertical rule.

                  The rule used to be horizontal with the philosophy half right-aligned
                  into it. That looked like a mirror and behaved like a bug: the half's
                  left edge landed wherever its text happened to end, a different x on
                  every row, and any half long enough to wrap left an orphan word ("it.",
                  "answer.") stranded on its own line. Both halves now start on the same
                  axis as the statement above them and wrap ragged-right like normal text.
                */}
                <div
                  data-pair
                  className={cn(
                    "mt-5 grid gap-y-4",
                    "border-l border-line/60 pl-5",
                    "md:grid-cols-[1fr_auto_1fr] md:gap-x-8 md:border-l-0 md:pl-0",
                  )}
                >
                  <p className="font-serif-italic text-lg text-fg-muted italic">{habit.philosophy}</p>
                  <span
                    aria-hidden
                    data-rule
                    className="hidden w-px origin-top self-stretch bg-line-strong/70 md:block"
                  />
                  <p className="font-mono text-sm leading-relaxed tracking-tight text-fg">
                    {habit.engineering}
                  </p>
                </div>

                {habit.body ? (
                  <p className="mt-7 leading-relaxed text-fg-muted measure">{habit.body}</p>
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
                      <blockquote className="font-serif-italic text-base text-balance text-fg-muted italic measure">
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
