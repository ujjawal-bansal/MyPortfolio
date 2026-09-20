"use client";

import { useEffect, useRef, useState } from "react";
import { consoleNote, returningHint, scrollBackNote } from "@/content/easterEggs";
import { useReducedMotion } from "@/hooks";
import { useAppStore } from "@/lib/store";

const RETURNING_VISITOR_THRESHOLD = 3;

/**
 * The quiet ones: the scroll-back note, the returning-visitor hint, and the console
 * message.
 *
 * Grouped in one component because they share a shape — each watches for a condition,
 * fires once, and then never bothers the visitor again. None of them blocks anything,
 * none takes focus, and all are `aria-live="polite"` rather than assertive.
 */
export function Ambient() {
  const visits = useAppStore((s) => s.visits);
  const registerVisit = useAppStore((s) => s.registerVisit);
  const reducedMotion = useReducedMotion();

  const [scrollBackVisible, setScrollBackVisible] = useState(false);
  const reachedBottom = useRef(false);
  const scrollBackFired = useRef(false);

  /* ---- visit count + console note, once per load ---- */
  useEffect(() => {
    registerVisit();

    const style = "color:#c98f43;font-family:ui-monospace,monospace;font-size:12px";
    const body = "color:#b4ac9a;font-family:ui-monospace,monospace;font-size:12px";
    console.log(`%c${consoleNote.heading}\n%c${consoleNote.lines.join("\n")}`, style, body);
  }, [registerVisit]);

  /* ---- the way back up ---- */
  useEffect(() => {
    if (scrollBackFired.current) return;

    const onScroll = () => {
      const doc = document.documentElement;
      /*
        Both extra clauses guard against the same failure: before layout settles,
        `scrollHeight` is short enough that scroll position 0 satisfies "at the bottom".
        Scroll 0 is also "back up at the hero", so the reward fired on load — for
        everyone, including anyone following an anchor link. Require a page genuinely
        taller than two viewports, and a visitor who has actually gone down one.
      */
      const atBottom =
        doc.scrollHeight > window.innerHeight * 2 &&
        window.scrollY > window.innerHeight &&
        window.scrollY + window.innerHeight >= doc.scrollHeight - 120;
      if (atBottom) reachedBottom.current = true;

      const hero = document.getElementById("hero");
      const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;

      if (reachedBottom.current && !scrollBackFired.current && window.scrollY < heroBottom * 0.6) {
        scrollBackFired.current = true;
        setScrollBackVisible(true);
        window.setTimeout(() => setScrollBackVisible(false), 11_000);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const transition = reducedMotion ? "opacity 1ms" : "opacity 900ms var(--ease-out-quart)";

  return (
    <>
      {/* The scroll-back reward. */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-8 left-1/2 z-40 w-[min(26rem,calc(100vw-3rem))] -translate-x-1/2 px-2"
        style={{ opacity: scrollBackVisible ? 1 : 0, transition }}
      >
        {scrollBackVisible ? (
          <div className="rounded-lg border border-line bg-bg-raised/95 p-4 backdrop-blur-sm">
            <p className="font-mono text-[0.625rem] tracking-[0.2em] text-accent uppercase">
              {scrollBackNote.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-balance text-fg-muted">{scrollBackNote.body}</p>
          </div>
        ) : null}
      </div>

      {/* Third visit onward: the hint that the terminal exists. */}
      {visits >= RETURNING_VISITOR_THRESHOLD ? (
        <p
          className="pointer-events-none fixed bottom-5 left-5 z-40 font-mono text-[0.6875rem] tracking-widest text-fg-ghost"
          title="Press it"
        >
          {returningHint}
        </p>
      ) : null}
    </>
  );
}
