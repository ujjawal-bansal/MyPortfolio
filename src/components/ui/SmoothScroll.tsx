"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks";
import { useAppStore } from "@/lib/store";

/**
 * Lenis smooth scroll, driven by GSAP's ticker so ScrollTrigger and Lenis share one
 * clock instead of fighting over requestAnimationFrame.
 *
 * Under `prefers-reduced-motion` Lenis never starts: scrolling stays native and
 * instant, `html` keeps no `.lenis` class, and globals.css falls back accordingly.
 * ScrollTrigger is still registered, because Phase 3+ uses it for scroll-linked
 * *state* (which section is active, what has been revealed) and not only for motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const noteScrollDirection = useAppStore((s) => s.noteScrollDirection);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (reducedMotion) {
      // Still keep ScrollTrigger in sync with native scrolling.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      // Slightly longer than default: the site wants to feel unhurried, not slow.
      lerp: 0.1,
      wheelMultiplier: 1,
      // Lenis handles in-page anchors itself, so the nav needs no click interception.
      anchors: true,
      // GSAP drives the loop below.
      autoRaf: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    // Lenis wants milliseconds; the GSAP ticker counts seconds.
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    // Without this, a slow frame makes GSAP quietly skip time and the scroll jumps.
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, [reducedMotion]);

  // Scroll direction is tracked natively so it works with or without Lenis.
  useEffect(() => {
    let last = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        // Ignore sub-pixel jitter and rubber-banding at the top.
        if (Math.abs(y - last) > 4 && y > 0) {
          noteScrollDirection(y < last ? "up" : "down");
          last = y;
        } else if (y <= 0) {
          last = y;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [noteScrollDirection]);

  return <>{children}</>;
}
