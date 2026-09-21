"use client";

import { useEffect, useRef, useState } from "react";
import { soundtrack } from "@/content/soundtrack";

/**
 * The rule above the track being played, made into the thing that moves through it.
 *
 * It was already there — a hairline that turned amber when its track was the one in the
 * player. Now the amber runs as far as the track has played, and the playhead is a dot on
 * the line: the site's one recurring mark, doing a job for once. Drag it, press anywhere
 * on the line, or use the arrow keys.
 *
 * It exists only for the track the *visitor* is playing, and it says nothing in numbers.
 * The section stays silent about when anything was listened to; this is about where you
 * are in a song you chose, and a screen reader is the only thing told the time.
 *
 * ## Why it moves itself
 *
 * Spotify reports the position about once a second. Drawing only those reports makes the
 * dot tick, which reads as a clock. So between reports it is carried forward from the last
 * one by the time elapsed, in one rAF loop that exists only while the track is actually
 * sounding — and writes a single custom property, never React state. Under reduced motion
 * it takes the reports as they come instead: a step a second, and no loop at all.
 */

const ARROW_STEP_MS = 5000;
const PAGE_STEP_MS = 30000;

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

function clock(ms: number): string {
  const seconds = Math.max(0, Math.round(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function Scrubber({
  title,
  position,
  duration,
  reportedAt,
  running,
  reduced,
  onSeek,
}: {
  title: string;
  position: number;
  duration: number;
  /** `performance.now()` at which `position` was true. */
  reportedAt: number;
  /** Sounding, not merely playing-while-buffering: only then does the playhead advance. */
  running: boolean;
  reduced: boolean;
  onSeek: (ms: number) => void;
}) {
  const lineRef = useRef<HTMLDivElement | null>(null);
  /** While a pointer is down, where it is. The track is only moved when it is let go. */
  const [scrub, setScrub] = useState<number | null>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    const paint = (ms: number) => {
      line.style.setProperty("--played", String(duration > 0 ? clamp(ms / duration, 0, 1) : 0));
    };

    if (scrub !== null) return paint(scrub);
    if (!running || reduced) return paint(position);

    let frame = 0;
    const carry = () => {
      paint(position + (performance.now() - reportedAt));
      frame = requestAnimationFrame(carry);
    };
    carry();
    return () => cancelAnimationFrame(frame);
  }, [duration, position, reduced, reportedAt, running, scrub]);

  /** Where the playhead is now, including the part carried forward since the last report. */
  const now = () => clamp(position + (running ? performance.now() - reportedAt : 0), 0, duration);

  const at = (clientX: number) => {
    const box = lineRef.current?.getBoundingClientRect();
    if (!box || box.width === 0) return 0;
    return clamp((clientX - box.left) / box.width, 0, 1) * duration;
  };

  const shown = scrub ?? position;

  return (
    <div
      ref={lineRef}
      role="slider"
      tabIndex={0}
      aria-label={`${soundtrack.seek} ${title}`}
      aria-valuemin={0}
      aria-valuemax={Math.round(duration / 1000)}
      aria-valuenow={Math.round(shown / 1000)}
      aria-valuetext={soundtrack.seekValue(clock(shown), clock(duration))}
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        setScrub(at(event.clientX));
      }}
      onPointerMove={(event) => {
        if (scrub !== null) setScrub(at(event.clientX));
      }}
      onPointerUp={(event) => {
        if (scrub === null) return;
        onSeek(at(event.clientX));
        setScrub(null);
      }}
      // A vertical swipe that started on the line is a scroll, not a seek.
      onPointerCancel={() => setScrub(null)}
      onKeyDown={(event) => {
        const steps: Record<string, number> = {
          ArrowRight: ARROW_STEP_MS,
          ArrowUp: ARROW_STEP_MS,
          ArrowLeft: -ARROW_STEP_MS,
          ArrowDown: -ARROW_STEP_MS,
          PageUp: PAGE_STEP_MS,
          PageDown: -PAGE_STEP_MS,
        };
        let to: number | null = null;
        if (event.key in steps) to = now() + steps[event.key];
        else if (event.key === "Home") to = 0;
        else if (event.key === "End") to = duration;
        if (to === null) return;
        event.preventDefault();
        onSeek(clamp(to, 0, duration));
      }}
      // Twenty-four pixels of target for a one-pixel line; `touch-pan-y` so a thumb can
      // still scroll the page past it.
      // Centred on its line: the phone's slot under the waveform, or a column's top edge from `md`.
      className="group/line absolute inset-x-0 bottom-0 z-10 h-6 translate-y-1/2 cursor-pointer touch-pan-y outline-none md:top-0 md:bottom-auto md:-translate-y-1/2"
    >
      <span aria-hidden className="absolute inset-x-0 top-1/2 h-px bg-accent/25" />
      <span
        aria-hidden
        className="absolute top-1/2 left-0 h-px bg-accent/80"
        style={{ width: "calc(var(--played, 0) * 100%)" }}
      />
      <span
        aria-hidden
        className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_10px_var(--dot-glow)] transition-[scale] duration-200 group-hover/line:scale-150 group-focus-visible/line:scale-150 group-focus-visible/line:ring-2 group-focus-visible/line:ring-accent/40 group-focus-visible/line:ring-offset-2 group-focus-visible/line:ring-offset-bg"
        style={{ left: "calc(var(--played, 0) * 100%)", scale: scrub !== null ? "1.5" : undefined }}
      />
    </div>
  );
}
