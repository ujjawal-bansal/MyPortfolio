"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll animation that is switched off, wholesale, under `prefers-reduced-motion`.
 *
 * `gsap.matchMedia` is doing the real work: anything `build` creates — tweens, sets,
 * ScrollTriggers — is reverted automatically when the query stops matching. That means
 * a visitor who turns reduced motion on mid-visit gets the static layout immediately,
 * rather than on the next reload.
 *
 * The contract for every caller: **markup must already be in its final, readable state**.
 * `build` animates *from* somewhere else and back. If this hook never runs, the section
 * must look finished — which is also what happens when JavaScript fails.
 *
 * **Built when it is about to be needed, not on load.** Every `from` tween reads the
 * element's computed style and then writes the starting state, and every ScrollTrigger
 * measures where it sits; one after another, for every row on the page, that was well
 * over a third of all the main-thread blocking during load on a throttled phone — spent
 * on sections nobody could see yet. So a section below the fold waits until it comes
 * within a screen of the viewport, which is still before anything in it can be seen.
 * Anything already on screen, or above it, is built exactly as before: before the first
 * paint, so nothing visible is ever shown finished and then snapped back to animate.
 */
export function useMotionEffect(
  scope: RefObject<HTMLElement | null>,
  build: (context: { selector: (query: string) => Element[] }) => void,
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;

    let mm: gsap.MatchMedia | null = null;
    const prepare = () => {
      mm = gsap.matchMedia(root);
      mm.add("(prefers-reduced-motion: no-preference)", (context) => {
        build({
          selector: (query) => (context.selector?.(query) as Element[]) ?? [],
        });
      });
    };

    if (root.getBoundingClientRect().top < window.innerHeight) {
      prepare();
      return () => mm?.revert();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries.find((candidate) => candidate.isIntersecting);
        if (!entry) return;
        observer.disconnect();
        // Only a jump — an anchor, find-in-page — lands here with the section already in
        // view. It stays as it is: hiding what the reader is looking at in order to
        // reveal it again would be a flash, and the finished state is the contract anyway.
        if (entry.boundingClientRect.top < window.innerHeight) return;
        prepare();
      },
      { rootMargin: "0px 0px 100% 0px" },
    );
    observer.observe(root);

    return () => {
      observer.disconnect();
      mm?.revert();
    };
    // Built once per mount, as useGSAP did before it: `build` is a fresh closure every
    // render and re-running it would restart every animation in the section.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
