"use client";

import { useSyncExternalStore } from "react";

/** Tailwind's `lg`. At and above this the page has a laptop's worth of row to fill. */
export const WIDE_BREAKPOINT = 1024;

const QUERY = `(min-width: ${WIDE_BREAKPOINT}px)`;

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * True on viewports `lg` and wider. The counterpart to `useIsMobile`, for layout that has
 * to change density rather than simply reflow — the listening trace draws more bars across
 * a laptop's row than a phone's, because the same bars stretched three times as wide stop
 * looking like a waveform.
 *
 * Server snapshot is `false`: the compact version first, the way the rest of the site
 * escalates only once it knows.
 */
export function useIsWide(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
