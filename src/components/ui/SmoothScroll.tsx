"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks";

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

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (reducedMotion) {
      // Still keep ScrollTrigger in sync with native scrolling.
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      // Slightly longer than default: the site wants to feel unhurried, not slow.
      // Settles a little more softly than Lenis's default: calm, not floaty.
      lerp: 0.085,
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

  return <>{children}</>;
}
