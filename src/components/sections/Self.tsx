"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { Portrait } from "@/components/ui/Portrait";
import { Section } from "@/components/ui/Section";
import { sectionById } from "@/content/sections";
import { coda, identities, intro, turn } from "@/content/self";
import { useMotionEffect } from "@/hooks";
import { DRAW, REVEAL, RISE, TRIGGER } from "@/lib/motion";

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
          scrollTrigger: { trigger: row, start: TRIGGER, once: true },
        })
        .from(row, { opacity: 0, y: RISE, ...REVEAL })
        // A beat after the line lands, so it can be read before it is crossed out. This
        // pause is the section's whole rhythm: never strike what has not been read.
        .fromTo(strike, { scaleX: 0 }, { scaleX: 1, ...DRAW }, "+=0.1")
        .fromTo(label, { opacity: 1 }, { opacity: 0.4, duration: 0.4 }, "<0.1");
    }

    gsap.from(selector("[data-turn]"), {
      scrollTrigger: { trigger: selector("[data-turn]")[0], start: TRIGGER, once: true },
      opacity: 0,
      y: RISE,
      ...REVEAL,
    });

    // The portrait develops as it scrolls in: the print rises a little, then comes up out
    // of a pale veil the way an image comes up in a tray. The markup rests in the finished
    // state — veil at zero — so this only ever animates *from* somewhere else.
    const [portrait] = selector("[data-portrait]");
    if (portrait) {
      gsap
        .timeline({ scrollTrigger: { trigger: portrait, start: "top 82%", once: true } })
        .from(portrait, { opacity: 0, y: 24, scale: 0.97, duration: 1.5, ease: "power2.out" })
        .fromTo(
          portrait.querySelector("[data-portrait-veil]"),
          { opacity: 0.94 },
          { opacity: 0, duration: 3.2, ease: "power2.out" },
          "<0.2",
        );
    }

    gsap.from(selector("[data-intro] > *"), {
      scrollTrigger: { trigger: selector("[data-intro]")[0], start: TRIGGER, once: true },
      opacity: 0,
      y: RISE,
      ...REVEAL,
      // Paragraphs, not list items: a longer beat between them, the pace of reading.
      stagger: 0.2,
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

        {/*
          The question, the answer, and beside them the portrait. On a laptop the photograph
          takes the column the prose leaves empty, level with the answer it sits beside. On
          a phone it goes between the two — the question, then a picture of the body that
          was just struck out of the list, then "the boring answer". Same element either
          way: the grid only moves it.
        */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-16">
          <p
            data-turn
            className="mt-12 font-serif-italic text-2xl text-balance text-accent italic measure md:mt-16 md:text-3xl lg:col-start-1 lg:row-start-1"
          >
            {turn}
          </p>

          <div className="mt-12 md:mt-14 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-10 lg:self-center">
            <Portrait />
          </div>

          <div data-intro className="mt-12 space-y-6 measure md:mt-16 lg:col-start-1 lg:row-start-2">
            {intro.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-lg leading-relaxed text-fg">
                {paragraph}
              </p>
            ))}
            <p className="pt-2 font-mono text-xs tracking-wide text-fg-faint">{coda}</p>
          </div>
        </div>
      </div>
    </Section>
  );
}
