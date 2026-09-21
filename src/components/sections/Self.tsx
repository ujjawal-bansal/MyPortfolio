"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { coda, identities, intro, turn } from "@/content/self";
import { useMotionEffect } from "@/hooks";

/**
 * Who am I? — a list of true answers, each struck through, then the real one.
 *
 * A neti-neti in structure rather than in words: nothing on screen says "not this, not
 * this", it just does it. The restraint matters more than the effect; each line is
 * crossed out quietly, at reading speed, and the section never congratulates itself.
 *
 * Markup renders in the finished state — struck through and dimmed. The animation
 * starts them un-struck and crosses them out, so no-JS and reduced motion both land on
 * the meaningful result.
 */
export function Self({ lead }: { lead?: React.ReactNode }) {
  const meta = sectionById("self");
  const scope = useRef<HTMLDivElement>(null);

  useMotionEffect(scope, ({ selector }) => {
    const rows = selector("[data-identity]");

    for (const row of rows) {
      const strike = row.querySelector("[data-strike]");
      const label = row.querySelector("[data-label]");

      gsap
        .timeline({
          scrollTrigger: { trigger: row, start: "top 82%", once: true },
        })
        .from(row, { opacity: 0, y: 14, duration: 0.5, ease: "power2.out" })
        .fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: "power2.inOut" }, "+=0.35")
        .fromTo(label, { opacity: 1 }, { opacity: 0.4, duration: 0.4 }, "<0.1");
    }

    gsap.from(selector("[data-turn]"), {
      scrollTrigger: { trigger: selector("[data-turn]")[0], start: "top 85%", once: true },
      opacity: 0,
      y: 18,
      duration: 0.8,
      ease: "power3.out",
    });

    gsap.from(selector("[data-intro] > *"), {
      scrollTrigger: { trigger: selector("[data-intro]")[0], start: "top 85%", once: true },
      opacity: 0,
      y: 16,
      duration: 0.7,
      stagger: 0.12,
      ease: "power2.out",
    });
  });

  if (!meta) return null;

  return (
    // The hero is full-height with its content centred, so it already ends in a large,
    // deliberate space. Adding this section's usual top padding on top of that stacked
    // two gaps into one 417px void — far larger than the 256px between every other
    // section. The hero's space is the gap.
    <Section meta={meta} className="pt-0 md:pt-0" lead={lead}>
      <div ref={scope}>
        <ol className="mt-8 md:mt-10">
          {identities.map((identity) => (
            <li
              key={identity.text}
              data-identity
              className="grid grid-cols-1 items-baseline gap-x-8 gap-y-1 border-b border-line/40 py-4 md:grid-cols-[minmax(0,22rem)_1fr] md:py-5"
            >
              <span data-label className="relative inline-block self-start justify-self-start opacity-40">
                <span className="font-serif text-xl md:text-2xl">{identity.text}</span>
                {/* origin-left so the rule draws left-to-right, like crossing it out. */}
                <span
                  data-strike
                  aria-hidden
                  className="absolute top-1/2 left-0 h-px w-full origin-left bg-fg-muted"
                />
              </span>
              {identity.aside ? (
                <span className="font-mono text-xs leading-relaxed tracking-wide text-fg-faint">
                  {identity.aside}
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <p
          data-turn
          className="mt-12 font-serif-italic text-2xl text-balance text-accent italic measure md:mt-16 md:text-3xl"
        >
          {turn}
        </p>

        <div data-intro className="mt-12 space-y-6 measure md:mt-16">
          {intro.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed text-fg">
              {paragraph}
            </p>
          ))}
          <p className="pt-2 font-mono text-xs tracking-wide text-fg-faint">{coda}</p>
        </div>
      </div>
    </Section>
  );
}
