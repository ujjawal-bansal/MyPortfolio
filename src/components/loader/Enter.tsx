"use client";

import { useEffect, useState } from "react";
import { enterWord } from "@/content/enter";
import { cn } from "@/lib/utils";

/**
 * अथ — the entrance.
 *
 * A point, one breath, one word, and then the site opens out of the point rather than
 * cutting to it. The site's own scene rests at the centre of the viewport at scroll 0,
 * so the dot here sits exactly where that one is: the overlay lifts and the point it
 * leaves behind is real.
 *
 * It renders on the server, so it is in the first HTML and paints before any JavaScript.
 * The breath and the word are CSS animations for the same reason — none of this waits
 * for React.
 *
 * **What it deliberately does not wait for.** `document.fonts.ready` was the obvious
 * signal and it is the wrong one: Tiro Devanagari is 117kb, larger than the whole
 * critical path, and gating entry on it would make a 117kb font the slowest thing about
 * the site. The word is set in whatever Devanagari face is already on the machine and
 * swaps to Tiro if and when it arrives, under a fade that hides the change.
 *
 * So the signal is the honest one: React has hydrated (this effect is proof) and one
 * frame has painted. `FLOOR` is the only concession and it is not a simulated wait — it
 * is how long the gesture takes to say its one word. Leaving before it finishes is a
 * flicker, which is worse than no loader. Nothing here ever waits on a network.
 *
 * Three things guarantee it always leaves: this component, a CSS failsafe at 2.6s, and a
 * `<noscript>` rule in the layout.
 */
const FLOOR = 520;
const EXIT = 700;

export function Enter() {
  const [phase, setPhase] = useState<"holding" | "leaving" | "gone">("holding");

  useEffect(() => {
    let cancelled = false;
    const startedAt = performance.now();

    // Read the preference here, not in render: a media query resolves differently on the
    // server and the markup has to match or hydration complains.
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const floor = calm ? 0 : FLOOR;

    // One frame, so the page underneath has actually painted before it is revealed.
    const frame = requestAnimationFrame(() => {
      const left = Math.max(0, floor - (performance.now() - startedAt));
      window.setTimeout(() => {
        if (!cancelled) setPhase("leaving");
      }, left);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (phase !== "leaving") return;
    const t = window.setTimeout(() => setPhase("gone"), EXIT);
    return () => clearTimeout(t);
  }, [phase]);

  if (phase === "gone") return null;
  const leaving = phase === "leaving";

  return (
    <div
      id="enter"
      // Decorative. The page is already behind it and already readable to a screen
      // reader, which should not be made to wait for a gesture it cannot see.
      aria-hidden
      className={cn(
        "fixed inset-0 z-[100] bg-bg transition-opacity ease-[var(--ease-out-quart)]",
        leaving ? "pointer-events-none opacity-0" : "opacity-100",
      )}
      style={{
        transitionDuration: `${EXIT}ms`,
        // Only ever matters if this component stops working.
        animation: leaving ? undefined : "enter-failsafe 600ms ease-out 2.6s forwards",
      }}
    >
      {/* Dead centre, which is where the site's own converged point sits. */}
      <div
        className="absolute top-1/2 left-1/2 size-1.5 transition-transform ease-[var(--ease-out-quart)]"
        style={{
          transitionDuration: `${EXIT}ms`,
          transform: `translate(-50%, -50%) scale(${leaving ? 2.6 : 1})`,
        }}
      >
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent opacity-0 motion-safe:animate-[enter-halo_5s_var(--ease-in-out-soft)_infinite]"
          style={leaving ? { opacity: 0, animation: "none" } : undefined}
        />
        <span className="block size-1.5 rounded-full bg-dot motion-safe:animate-[enter-breath_4s_var(--ease-in-out-soft)_infinite]" />
      </div>

      {/*
        Painted with the first frame, faded in by CSS so it needs no JavaScript and no
        webfont. If Tiro arrives mid-fade the change lands under the opacity ramp.
      */}
      <p
        lang="sa"
        className="absolute top-1/2 left-1/2 mt-12 -translate-x-1/2 font-devanagari text-2xl text-fg-faint motion-safe:animate-[enter-word_700ms_var(--ease-out-quart)_140ms_both]"
      >
        {enterWord.devanagari}
      </p>
    </div>
  );
}
