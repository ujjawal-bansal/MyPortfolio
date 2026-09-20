"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { mahavakyas } from "@/content/philosophy";
import type { Verse } from "@/content/philosophy";
import { mainContentId, sectionAfter, sectionById } from "@/content/sections";
import { useMotionEffect } from "@/hooks";
import { cn } from "@/lib/utils";

/**
 * Four mahāvākyas, one from each Veda, that the page slows down for.
 *
 * On a wide screen with motion allowed, the section pins and each verse is revealed in
 * stages as you scroll through it: Devanagari alone, then transliteration, then the
 * translation, then an invitation to ask what it means. That staging *is* the argument —
 * a sentence you are made to sit with reads differently from one you scroll past.
 *
 * Everywhere else — narrow screens, reduced motion, no JavaScript — the whole thing is a
 * plain vertical list with every verse fully visible and every disclosure operable. The
 * pin is an enhancement, never the mechanism.
 *
 * Accessibility notes, because a pinned scrubbed section is normally hostile ground:
 * - Inactive verses get `inert`, so Tab never lands on something at opacity 0.
 * - A skip link is the first focusable thing inside the section.
 * - The prompt is a real <button aria-expanded>; the panel is ordinary markup.
 * - Opening a panel while pinned is fine — the panel scrolls internally.
 */
export function Shlokas() {
  const meta = sectionById("shlokas");
  const scope = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [open, setOpen] = useState<string | null>(null);

  useMotionEffect(scope, ({ selector }) => {
    // Below `md` the viewport is too short to pin four staged verses without it
    // becoming a fight with the reader. Plain list there.
    if (window.innerWidth < 768) return;

    const section = selector("[data-pin-root]")[0] as HTMLElement | undefined;
    const cards = selector("[data-verse]") as HTMLElement[];
    if (!section || cards.length === 0) return;

    setPinned(true);

    // Set the initial inert state up front. `onUpdate` only fires once the pin starts
    // scrubbing, so without this every verse is focusable — including the three sitting
    // at opacity 0 — for as long as the reader has not moved yet.
    cards.forEach((card, i) => {
      if (i > 0) card.setAttribute("inert", "");
      else card.removeAttribute("inert");
    });

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: `+=${cards.length * 110}%`,
        pin: true,
        scrub: 0.6,
        onUpdate: (self) => {
          // Only the verse currently on screen may receive focus.
          const index = Math.min(cards.length - 1, Math.floor(self.progress * cards.length));
          cards.forEach((card, i) => {
            if (i === index) card.removeAttribute("inert");
            else card.setAttribute("inert", "");
          });
        },
      },
    });

    cards.forEach((card, index) => {
      const part = (name: string) => card.querySelector(`[data-part="${name}"]`);

      if (index > 0) timeline.fromTo(card, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
      timeline
        .fromTo(part("devanagari"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6 })
        // The pause. Nothing happens here on purpose.
        .to({}, { duration: 0.5 })
        .fromTo(part("iast"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 })
        .to({}, { duration: 0.3 })
        .fromTo(part("translation"), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 })
        .to({}, { duration: 0.35 })
        .fromTo(part("prompt"), { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .to({}, { duration: 0.8 });

      if (index < cards.length - 1) timeline.to(card, { autoAlpha: 0, duration: 0.4 });
    });

    /**
     * Keyboard escape hatch.
     *
     * The parts stage with plain `opacity`, never `autoAlpha` — autoAlpha adds
     * `visibility: hidden` at zero, and a hidden button cannot receive focus, which
     * would put the disclosure permanently out of reach of anyone navigating by Tab.
     * Plain opacity keeps it focusable; `inert` on inactive verses controls tab order.
     *
     * When focus lands on a not-yet-revealed verse, kill the tweens staging it and show
     * it whole. Killing rather than setting is deliberate — a plain `gsap.set` would be
     * undone by the next scrub tick.
     */
    const onFocusIn = (event: FocusEvent) => {
      const card = (event.target as HTMLElement | null)?.closest?.("[data-verse]");
      if (!card) return;
      const parts = card.querySelectorAll("[data-part]");
      gsap.killTweensOf(parts);
      gsap.set(parts, { opacity: 1, y: 0 });
      gsap.killTweensOf(card);
      gsap.set(card, { autoAlpha: 1 });
    };
    section.addEventListener("focusin", onFocusIn);

    return () => {
      section.removeEventListener("focusin", onFocusIn);
      setPinned(false);
      for (const card of cards) card.removeAttribute("inert");
      ScrollTrigger.refresh();
    };
  });

  if (!meta) return null;

  return (
    <section id={meta.id} aria-labelledby="shlokas-heading" className="relative scroll-mt-20 overflow-x-clip">
      <div ref={scope}>
        <div className="mx-auto w-full max-w-wide gutter pt-24 md:pt-32">
          <p className="mb-3 font-mono text-[0.625rem] tracking-[0.2em] text-fg-faint uppercase">
            {meta.kicker}
          </p>
          <h2
            id="shlokas-heading"
            className="font-serif text-3xl font-light tracking-tight text-balance text-fg-strong md:text-4xl"
          >
            {meta.title}
          </h2>

          {/* First focusable thing in the section: a way out of it. */}
          <a
            href={`#${sectionAfter(meta.id)?.id ?? mainContentId}`}
            className="mt-6 inline-block font-mono text-[0.6875rem] tracking-wide text-fg-ghost hover:text-accent focus-visible:text-accent"
          >
            Skip these →
          </a>
        </div>

        <div
          data-pin-root
          className={cn(
            "mx-auto w-full max-w-wide gutter",
            pinned ? "relative flex min-h-svh items-center" : "flex flex-col gap-24 py-20 md:gap-32",
          )}
        >
          {mahavakyas.map((verse, index) => (
            <VerseCard
              key={verse.id}
              verse={verse}
              index={index}
              total={mahavakyas.length}
              pinned={pinned}
              open={open === verse.id}
              onToggle={() => setOpen((current) => (current === verse.id ? null : verse.id))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function VerseCard({
  verse,
  index,
  total,
  pinned,
  open,
  onToggle,
}: {
  verse: Verse;
  index: number;
  total: number;
  pinned: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = `${verse.id}-context`;

  return (
    <article
      data-verse
      className={cn(
        "w-full",
        // Stacked in the same place when pinned so they cross-fade; a normal flow item
        // otherwise. The first is visible at rest so the section is never blank.
        pinned && "absolute inset-x-0 top-1/2 -translate-y-1/2",
        pinned && index > 0 && "invisible opacity-0",
      )}
    >
      <p className="font-mono text-[0.625rem] tracking-[0.2em] text-fg-ghost tabular-nums">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {verse.citation.tradition}
      </p>

      <p data-part="devanagari" lang="sa" className="mt-6 text-4xl leading-[1.7] text-fg-strong md:text-6xl">
        {verse.devanagari}
      </p>

      <p data-part="iast" className="mt-6 font-serif text-lg text-accent italic md:text-xl">
        {verse.iast}
      </p>

      <p
        data-part="translation"
        className="mt-4 font-serif text-2xl text-balance text-fg measure md:text-3xl"
      >
        {verse.translation}
      </p>

      <div data-part="prompt" className="mt-8">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-fg-faint transition-colors hover:border-accent/50 hover:text-accent"
        >
          {open ? "Close" : verse.prompt}
        </button>

        <div
          id={panelId}
          hidden={!open}
          className="mt-6 max-h-[40vh] overflow-y-auto overscroll-contain border-l border-line/70 pl-5 measure"
        >
          <p className="text-sm leading-relaxed text-fg-muted">{verse.context}</p>

          {verse.readings ? (
            <dl className="mt-5 space-y-4">
              {verse.readings.map((reading) => (
                <div key={reading.label}>
                  <dt className="font-mono text-[0.6875rem] tracking-wide text-fg-strong">{reading.label}</dt>
                  {/*
                    "One reading is…" — never "this means". Where the tradition
                    disagrees with itself, the site says so. See docs/SOURCES.md.
                  */}
                  <dd className="mt-1 text-sm leading-relaxed text-fg-muted">
                    One reading is: {reading.body}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          <p className="mt-5 font-mono text-[0.625rem] leading-relaxed text-fg-ghost">
            {verse.citation.text} {verse.citation.location}
            {verse.citation.tradition ? ` · ${verse.citation.tradition}` : ""}
            {verse.citation.note ? ` · ${verse.citation.note}` : ""}
          </p>
        </div>
      </div>
    </article>
  );
}
