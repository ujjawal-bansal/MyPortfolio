"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Availability } from "@/components/ui/Availability";
import { site } from "@/content/site";
import { useMotionEffect } from "@/hooks";

/**
 * The end, which is the beginning (BRIEF §29).
 *
 * Thought → Action → Experience → Thought, closing on the word it opened with. The
 * particle scene converges here on its own; the footer keeps the ending quiet and useful.
 *
 * Three bands, in descending weight — the loop and its gloss, the line handed to the
 * reader, then the colophon. Everything sits on the one left axis the rest of the site
 * uses; the only thing allowed to the right edge is the availability signal, which is
 * paired with the name rather than floating free. The hairline above the colophon is
 * what separates saying something from signing it.
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
      });
  });

  return (
    <footer ref={scope} data-neti-layer="interface" className="relative z-10 border-t border-line/60">
      <div className="mx-auto w-full max-w-wide gutter py-16 md:py-20">
        {/* The loop. The last word is the first word. */}
        <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {site.footer.loop.map((step, index) => (
            <li key={`${step}-${index}`} data-loop-item className="flex items-center gap-3">
              {/*
                The arrow belongs to the step it points at, not the one behind it. The loop
                wraps on a phone, and an arrow trailing a line end dangles; leading the new
                line it reads as a continuation mark.
              */}
              {index > 0 ? (
                <span aria-hidden className="font-mono text-xs text-fg-ghost">
                  →
                </span>
              ) : null}
              <span
                className={
                  index === site.footer.loop.length - 1
                    ? "font-serif text-lg text-accent italic"
                    : "font-serif text-lg text-fg-muted"
                }
              >
                {step}
              </span>
            </li>
          ))}
        </ol>

        {/* Close to the loop, because it is a gloss on the loop rather than a new thought. */}
        <p className="mt-8 font-serif text-lg text-balance text-fg-muted measure">{site.footer.line}</p>

        {/*
          The turn outward, and the last thing anyone reads — so it gets the room and the
          size. Dimmer than the line above despite being larger: presence without volume.
        */}
        <p className="mt-16 font-serif text-xl text-balance text-fg-faint italic measure md:mt-20">
          {site.footer.question}
        </p>

        {/* The colophon. Metadata, hairlined off, genuinely last. */}
        <div className="mt-20 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-4 border-t border-line/60 pt-8 md:mt-24">
          <p className="font-mono text-xs text-fg-ghost">
            {site.name} · {new Date().getFullYear()}
          </p>
          <Availability />
        </div>
      </div>
    </footer>
  );
}
