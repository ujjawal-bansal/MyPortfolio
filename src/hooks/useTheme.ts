"use client";

import { useCallback, useSyncExternalStore } from "react";
import { applyTheme, DEFAULT_THEME, THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

const listeners = new Set<() => void>();
function emit() {
  for (const l of listeners) l();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab switching theme should switch this one too.
  window.addEventListener("storage", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onChange);
  };
}

function read(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

/**
 * The theme, read from the DOM rather than from React state.
 *
 * The inline script in layout.tsx has already written `data-theme` before hydration, so
 * the DOM is the source of truth and `useState` would only be a second, staler copy.
 * `useSyncExternalStore` with a server snapshot of the default keeps SSR and the client
 * agreeing on the first render.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => DEFAULT_THEME);

  const setTheme = useCallback((next: Theme) => {
    applyTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Private mode, blocked storage — the theme still applies for this page.
    }
    emit();
  }, []);

  const toggle = useCallback(() => setTheme(read() === "dark" ? "light" : "dark"), [setTheme]);

  return { theme, setTheme, toggle };
}
