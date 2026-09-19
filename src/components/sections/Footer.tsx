"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { site } from "@/content/site";
import { useMotionEffect } from "@/hooks";

/**
 * The end, which is the beginning (BRIEF §29).
 *
 * Thought → Action → Experience → Thought, closing on the word it opened with, and one
 * dot — the same dot the page started on, having been a field, a word, a network and a
 * system in between. The particle scene converges here on its own; this is its echo in
 * the markup.
 */
export function Footer() {
  const scope = useRef<HTMLElement>(null);

  useMotionEffect(scope, ({ selector }) => {
    gsap
      .timeline({
        scrollTrigger: { trigger: scope.current, start: "top 85%", once: true },
      })
      .from(selector("[data-loop-item]"), {
        opacity: 0,
        y: 10,
        duration: 0.5,
        stagger: 0.12,
        ease: "power2.out",
      })
      .from(
        selector("[data-final-dot]"),
        { scale: 0, opacity: 0, duration: 0.8, ease: "back.out(2)" },
        "-=0.2",
      );
  });

  return (
    <footer ref={scope} data-neti-layer="interface" className="relative z-10 border-t border-line/60">
      <div className="mx-auto w-full max-w-wide gutter py-16 md:py-20">
        {/* The loop. The last word is the first word. */}
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {site.footer.loop.map((step, index) => (
            <li key={`${step}-${index}`} data-loop-item className="flex items-center gap-3">
              <span
                className={
                  index === site.footer.loop.length - 1
                    ? "font-serif text-lg text-accent italic"
                    : "font-serif text-lg text-fg-muted"
                }
              >
                {step}
              </span>
              {index < site.footer.loop.length - 1 ? (
                <span aria-hidden className="font-mono text-xs text-fg-ghost">
                  →
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <p className="mt-10 font-serif text-lg text-balance text-fg-faint measure">{site.footer.line}</p>

        <div className="mt-14 flex items-end justify-between gap-6">
          <p className="font-mono text-xs text-fg-ghost">
            {site.name} · {new Date().getFullYear()}
          </p>

          {/* Back to one point. */}
          <span
            aria-hidden
            data-final-dot
            className="mb-1 size-1.5 shrink-0 rounded-full bg-dot"
            style={{ boxShadow: "0 0 18px var(--dot-glow)" }}
          />
        </div>
      </div>
    </footer>
  );
}
