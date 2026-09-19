"use client";

import { useSyncExternalStore } from "react";

/** Matches Tailwind's `md` breakpoint: below this we ship the simplified scene. */
export const MOBILE_BREAKPOINT = 768;

const QUERY = `(max-width: ${MOBILE_BREAKPOINT - 0.02}px)`;

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * True on viewports narrower than `md`. Drives the *simplified* 3D scene —
 * never the removal of it (see BRIEF §31).
 *
 * Server snapshot is `true`: mobile gets the cheaper scene if we guess wrong.
 */
export function useIsMobile(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => true);
}
