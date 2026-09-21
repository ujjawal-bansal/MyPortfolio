"use client";

import { useEffect, useState } from "react";
import { visitorsCopy } from "@/content/visitors";
import { cn } from "@/lib/utils";

/**
 * All-time unique visitors, in a circle beside the theme toggle.
 *
 * It opens as an eye and resolves into a number. The eye is not decoration: it says what
 * the circle is before it can say how many, so the number arrives already explained. The
 * hold is a deliberate beat rather than a loading lie — the count is usually there long
 * before it, and nothing on the page waits for either.
 *
 * Hovering shows the wording **below** the circle. Nothing replaces the number or the eye:
 * a control that swaps its own contents under the cursor is a control you cannot read and
 * point at simultaneously.
 *
 * Large numbers are compacted (1.2K) because a 44px circle cannot hold "12,847" at a
 * legible size. The exact figure is always in the tooltip and the accessible name, so the
 * compaction costs a glance, never the information.
 *
 * One request per page load, shared: `inflight` is module scope, so React's development
 * double-invoke and any second mount reuse the same promise. Not polled — a figure that
 * ticks while you watch it is a dashboard, and every poll is two Redis commands.
 *
 * If Redis is unreachable, unconfigured, or the visitor is filtered as a bot, this
 * renders nothing at all. An empty corner beats a zero or a broken circle.
 */
const REVEAL_MS = 1900;

let inflight: Promise<number | null> | null = null;

function loadCount(): Promise<number | null> {
  inflight ??= fetch("/api/visitors", { method: "POST", cache: "no-store" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: { count?: unknown } | null) =>
      typeof data?.count === "number" && Number.isFinite(data.count) ? data.count : null,
    )
    .catch(() => null);
  return inflight;
}

export function VisitorCount() {
  const [count, setCount] = useState<number | null>(null);
  const [past, setPast] = useState(false);

  useEffect(() => {
    let alive = true;
    void loadCount().then((value) => {
      if (alive) setCount(value);
    });
    const t = window.setTimeout(() => {
      if (alive) setPast(true);
    }, REVEAL_MS);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);

  // Nothing to show at zero, and nothing if Redis never answered.
  if (count === null || count < 1) return null;

  const exact = new Intl.NumberFormat("en-US").format(count);
  const short =
    count >= 1000
      ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(count)
      : exact;
  const meaning = `${exact} ${count === 1 ? visitorsCopy.one : visitorsCopy.many}`;
  const showNumber = past;

  return (
    <div
      role="img"
      aria-label={meaning}
      data-chrome-float
      className="group fixed top-4 right-32 z-50 flex size-11 items-center justify-center rounded-full border border-line bg-bg-raised/80 backdrop-blur-sm md:top-6 md:right-20"
    >
      {/* Both states share the cell, so neither reflows the other as they cross-fade. */}
      <span className="grid place-items-center">
        <svg
          aria-hidden
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            "size-[18px] text-fg-muted transition-opacity duration-500 ease-[var(--ease-out-quart)] [grid-area:1/1]",
            showNumber ? "opacity-0" : "opacity-100",
          )}
        >
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12Z" />
          <circle cx="12" cy="12" r="2.6" />
        </svg>
        <span
          aria-hidden
          className={cn(
            "font-mono text-[0.6875rem] tracking-tight text-fg-muted tabular-nums transition-opacity duration-500 ease-[var(--ease-out-quart)] [grid-area:1/1]",
            showNumber ? "opacity-100" : "opacity-0",
          )}
        >
          {short}
        </span>
      </span>

      {/*
        Below the circle, never inside it. Absolutely positioned so its width never
        pushes the circle around, and right-aligned because it sits near the viewport edge.
      */}
      <span
        aria-hidden
        className="pointer-events-none absolute top-full right-0 mt-2 w-max rounded bg-bg/90 px-2 py-1 font-mono text-[0.625rem] whitespace-nowrap text-fg-faint opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"
      >
        {meaning}
      </span>
    </div>
  );
}
