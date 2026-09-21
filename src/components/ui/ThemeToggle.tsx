"use client";

import { useTheme } from "@/hooks";

/**
 * Light / dark, as the dot.
 *
 * Not a sun and a moon. The site is built on one point, so the control is that point
 * half-lit — a circle with its right half filled, turning 180° as it switches. It reads
 * as a contrast mark, which is what it is, and it costs no new vocabulary.
 *
 * The visible glyph is `aria-hidden`; the button's accessible name says what pressing it
 * will do, and `aria-pressed` carries the current state, so a screen reader gets the
 * whole story from the button rather than from the drawing.
 */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      // Left of the mobile menu button below `md`, and where the menu button is not, above it.
      data-chrome-float
      className="group fixed top-4 right-[4.5rem] z-50 flex size-11 items-center justify-center rounded-full border border-line bg-bg-raised/80 backdrop-blur-sm transition-colors duration-300 hover:border-accent/50 focus-visible:border-accent/50 md:top-6 md:right-6"
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="size-[18px] text-fg-muted transition-[color,transform] duration-500 ease-[var(--ease-out-quart)] group-hover:text-accent group-focus-visible:text-accent"
        style={{ transform: isDark ? "rotate(0deg)" : "rotate(180deg)" }}
      >
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
        {/* The lit half. A semicircle, so the mark is unmistakable at 18px. */}
        <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
      </svg>
    </button>
  );
}
