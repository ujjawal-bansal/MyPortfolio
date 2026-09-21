"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { stack } from "@/content/stack";
import { useMotionEffect } from "@/hooks";
import { FOLLOW, MARK, REVEAL, TRIGGER } from "@/lib/motion";

/**
 * The instruments, arranged along the thought → system path rather than by category.
 *
 * "Languages / Frontend / Backend / Tools" is a logo grid with the logos removed: it
 * sorts tools by what they are. This sorts them by what they do — Think, Show, Decide,
 * Remember, Judge, Keep honest — so the section says something about the work rather
 * than listing the contents of a package.json.
 */
export function Stack() {
  const meta = sectionById("stack");
  const scope = useRef<HTMLDivElement>(null);

  useMotionEffect(scope, ({ selector }) => {
    for (const row of selector("[data-stage]")) {
      gsap
        .timeline({ scrollTrigger: { trigger: row, start: TRIGGER, once: true } })
        .from(row.querySelector("[data-marker]"), { scale: 0, opacity: 0, ...MARK })
        // A row of pills is one gesture, not six: a short stagger, so it reads as a
        // single arrival sweeping across rather than items being dealt out.
        .from(
          row.querySelectorAll("[data-instrument]"),
          { opacity: 0, y: 10, ...REVEAL, stagger: 0.07 },
          FOLLOW,
        );
    }
  });

  if (!meta) return null;

  return (
    <Section meta={meta}>
      <div ref={scope} className="relative mt-8 md:mt-10">
        <span
          aria-hidden
          className="absolute top-3 bottom-3 left-[5px] w-px bg-line-strong/70 md:left-[calc(11rem+5px)]"
        />

        <ol>
          {stack.map((group) => (
            <li
              key={group.id}
              data-stage
              className="relative grid grid-cols-1 gap-x-8 gap-y-3 pb-8 pl-8 last:pb-0 md:grid-cols-[11rem_1fr] md:pl-0"
            >
              {/* Stage name: what this layer does, not what it is. */}
              <div className="md:text-right">
                <p className="font-serif text-xl text-accent md:text-2xl">{group.stage}</p>
                <p className="mt-1 font-mono text-[0.625rem] tracking-[0.2em] text-fg-ghost uppercase">
                  {group.label}
                </p>
              </div>

              <span
                aria-hidden
                data-marker
                className="absolute top-3 left-0 size-2.5 rounded-full bg-accent-dim md:left-[11rem]"
              />

              <div className="md:pl-8">
                <p className="text-sm text-balance text-fg-muted measure">{group.line}</p>
                <ul className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                  {group.items.map((item) => (
                    <li
                      key={item.name}
                      data-instrument
                      className="rounded-full border border-line/70 px-3 py-1 text-sm text-fg"
                    >
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
