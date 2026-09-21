"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Decorative loops run only while they can be seen.
 *
 * The site has a few animations that never end — the hero's words drifting and turning,
 * the availability signal in the footer, the portrait's turning rim. Each one costs the
 * browser a little work every frame for as long as it runs, and until this they all ran
 * all the time: the hero's words were dissolving into Sanskrit while you read the footer.
 * Measured at 4× CPU, that was about a fifth of the main thread spent on motion nobody
 * could see, which on a slower machine is the difference between a smooth scroll and not.
 *
 * Mark an element with `data-loops` and everything animating inside it pauses while it
 * is off-screen (a CSS rule on `[data-offscreen]`, in globals.css) and resumes, from
 * where it stopped, as it comes back. A 100px margin so nothing is caught mid-resume.
 *
 * Re-scans on navigation, because this lives in the layout and outlasts the page.
 */
export function PauseOffscreen() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>("[data-loops]");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) entry.target.toggleAttribute("data-offscreen", !entry.isIntersecting);
      },
      { rootMargin: "100px" },
    );
    targets.forEach((target) => observer.observe(target));

    return () => {
      observer.disconnect();
      targets.forEach((target) => target.removeAttribute("data-offscreen"));
    };
  }, [pathname]);

  return null;
}
