"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { netiNetiQuestion, netiNetiSteps } from "@/content/easterEggs";
import { useReducedMotion } from "@/hooks";
import { useAppStore } from "@/lib/store";

/**
 * नेति नेति — not this, not this.
 *
 * Removes the page in the order it was built up: the work, then the words, then the
 * particle field, then the interface itself. What is left is a blank screen and one
 * question. Then everything comes back.
 *
 * Layers are marked with `data-neti-layer` at their source rather than selected by tag,
 * so adding a section later does not silently escape the removal.
 *
 * Esc exits at any point. Under reduced motion the whole thing is an instant cut rather
 * than a sequence — the idea survives; the theatre does not.
 */

const LAYERS = ["work", "words", "field", "interface"] as const;

export function NetiNeti() {
  const phase = useAppStore((s) => s.netiNeti);
  const endNetiNeti = useAppStore((s) => s.endNetiNeti);
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLParagraphElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const active = phase !== "idle";

  useEffect(() => {
    if (!active) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const targets = LAYERS.map((layer) =>
      Array.from(document.querySelectorAll<HTMLElement>(`[data-neti-layer="${layer}"]`)),
    );

    const finish = () => {
      timelineRef.current?.kill();
      timelineRef.current = null;
      gsap.set(targets.flat(), { clearProps: "opacity,filter" });
      gsap.set([overlayRef.current, questionRef.current, captionRef.current], {
        clearProps: "opacity",
      });
      previouslyFocused?.focus?.();
      endNetiNeti();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        finish();
      }
    };
    document.addEventListener("keydown", onKey);

    if (reducedMotion) {
      // Straight to the point, held, then back. No staged dissolve.
      gsap.set(targets.flat(), { opacity: 0 });
      gsap.set(questionRef.current, { opacity: 1 });
      const timer = window.setTimeout(finish, 5200);
      return () => {
        window.clearTimeout(timer);
        document.removeEventListener("keydown", onKey);
        window.clearTimeout(timer);
      };
    }

    const timeline = gsap.timeline({ onComplete: finish });
    timelineRef.current = timeline;

    LAYERS.forEach((_, index) => {
      timeline
        .set(captionRef.current, { textContent: netiNetiSteps[index] }, ">")
        .to(captionRef.current, { opacity: 1, duration: 0.35 })
        .to(targets[index], { opacity: 0, duration: 0.9, ease: "power2.inOut" }, "<")
        .to(captionRef.current, { opacity: 0, duration: 0.35 }, ">-0.1");
    });

    timeline
      .to({}, { duration: 0.7 })
      .to(questionRef.current, { opacity: 1, duration: 1.1, ease: "power2.out" })
      .to({}, { duration: 2.6 })
      .to(questionRef.current, { opacity: 0, duration: 0.8 })
      .to(targets.flat(), { opacity: 1, duration: 1.1, ease: "power2.out", stagger: 0.06 });

    return () => {
      document.removeEventListener("keydown", onKey);
      timeline.kill();
    };
  }, [active, reducedMotion, endNetiNeti]);

  if (!active) return null;

  return (
    <div
      ref={overlayRef}
      className="pointer-events-none fixed inset-0 z-[70] flex flex-col items-center justify-center"
      role="status"
      aria-live="polite"
    >
      <p
        ref={questionRef}
        className="max-w-2xl gutter text-center font-serif text-2xl text-balance text-fg-strong opacity-0 md:text-4xl"
      >
        {netiNetiQuestion}
      </p>

      <p
        ref={captionRef}
        className="absolute bottom-16 font-mono text-[0.6875rem] tracking-[0.2em] text-fg-ghost uppercase opacity-0"
      />

      <p className="absolute bottom-6 font-mono text-[0.625rem] tracking-wide text-fg-ghost">Esc to return</p>
    </div>
  );
}
