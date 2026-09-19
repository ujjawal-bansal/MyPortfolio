"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(hover: hover) and (pointer: fine)";

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches;
}

/**
 * True for a mouse or trackpad — false for touch, and false for a hybrid device
 * currently being touched.
 *
 * Distinct from `useIsMobile`: that one is about viewport width and decides how much
 * 3D to ship. This one is about input, and decides whether a cursor effect makes any
 * sense at all. A tablet in landscape is wide *and* touch.
 *
 * Server snapshot is `false`: no cursor effect until we know there is a cursor.
 */
export function useHasFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
