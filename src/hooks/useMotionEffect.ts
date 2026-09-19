"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

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
 */
export function useMotionEffect(
  scope: RefObject<HTMLElement | null>,
  build: (context: { selector: (query: string) => Element[] }) => void,
) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", (context) => {
        build({
          selector: (query) => (context.selector?.(query) as Element[]) ?? [],
        });
      });
      return () => {
        mm.revert();
      };
    },
    { scope },
  );
}
