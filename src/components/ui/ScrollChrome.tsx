"use client";

import { useEffect } from "react";

/**
 * On a phone, the floating controls step aside while you read.
 *
 * The visitor count, the theme toggle and the menu sit in the top-right corner. On a
 * laptop that corner is margin; on a phone there is no margin, and they sat on top of
 * whatever paragraph was passing underneath — "I build sy[45]s t[◐]…". So below `md` they
 * slide up out of the way while the page is scrolled down, and come back the moment it is
 * scrolled up or returns to the top: the way a phone's own browser treats its toolbar,
 * which is the behaviour a thumb already expects.
 *
 * Never while it would strand someone: not with the menu open, not with focus inside one
 * of the controls (a keyboard user tabbing through them would land on something invisible),
 * and not within the first screenful, where they are part of the opening.
 *
 * Sets `data-chrome="hidden"` on <html>; the rule that acts on it is in globals.css and
 * only applies below `md`.
 */
const NARROW = "(max-width: 767.98px)";
/** Scrolled less than this and the controls always show. */
const TOP_ZONE = 120;
/** Ignore scroll jitter smaller than this, so a resting thumb does not flicker them. */
const THRESHOLD = 6;

export function ScrollChrome() {
  useEffect(() => {
    const root = document.documentElement;
    const narrow = window.matchMedia(NARROW);
    let last = window.scrollY;
    let frame = 0;

    const blocked = () =>
      document.querySelector('[data-chrome-float] [aria-expanded="true"]') !== null ||
      document.activeElement?.closest("[data-chrome-float]") != null;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;

      if (!narrow.matches || y < TOP_ZONE || blocked()) {
        root.removeAttribute("data-chrome");
        last = y;
        return;
      }
      if (Math.abs(delta) < THRESHOLD) return;

      if (delta > 0) root.setAttribute("data-chrome", "hidden");
      else root.removeAttribute("data-chrome");
      last = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // Opening the menu or focusing a control while hidden brings them straight back.
    document.addEventListener("focusin", onScroll);
    narrow.addEventListener("change", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("focusin", onScroll);
      narrow.removeEventListener("change", onScroll);
      if (frame) cancelAnimationFrame(frame);
      root.removeAttribute("data-chrome");
    };
  }, []);

  return null;
}
