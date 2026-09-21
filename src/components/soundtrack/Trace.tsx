"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { soundtrack } from "@/content/soundtrack";
import { useHasFinePointer, useReducedMotion } from "@/hooks";
import { cn } from "@/lib/utils";

/**
 * Three recent tracks, drawn as one waveform.
 *
 * The strip is the waveform that was already at the foot of this section, given a reason
 * to exist. It runs left to right, most recent first, in three contiguous stretches — one
 * per track, each shaped from its own id. There are no dividers and no labels on it: the
 * seams are a taper rather than a cut, so it reads as one landscape that changes character
 * three times rather than as three charts placed side by side. That is also the only
 * chronology the section admits to. Left is more recent than right, and nothing anywhere
 * says when.
 *
 * ## The artwork is only ever seen through the bars
 *
 * Each stretch's bars are filled with that track's album art through an SVG pattern in
 * user space, so every bar samples the part of the image sitting behind it. Activating a
 * track fades that fill in. The cover is never shown as a cover — no square, no card —
 * only as the vertical slivers of it that the waveform happens to admit. A trace of the
 * thing rather than the thing, which is the argument the section is making anyway.
 *
 * ## Cost
 *
 * No canvas and no WebGL: sixty rectangles and a pattern fill do this, and an SVG stays
 * crisp, themes itself from the same custom properties as everything else, and needs no
 * fallback for a device that cannot run it.
 *
 * The cursor response writes transforms straight to the DOM inside one rAF loop rather
 * than through React state, because sixty re-renders a frame is not a thing to do to a
 * page. The loop exists only while the pointer is over the strip, plus the second it
 * takes to settle afterwards. Artwork is not requested until the section has been
 * scrolled to, so a visitor who never reaches the bottom pays nothing for it.
 */

export interface TraceTrack {
  id: string;
  title: string;
  artists: string;
  art: string | null;
  url: string;
  /** Bar heights, 0–1. Computed on the server, so it cannot hydrate into a different shape. */
  shape: number[];
}

/** viewBox units. The strip is stretched to whatever width it is given. */
const H = 100;
const CENTER = H / 2;
const PITCH = 6;
const BAR_W = 2.6;
const MAX_BAR_H = 54;

/** How much the whole stretch rises when its track is the active one. */
const STRETCH_SWELL = 1.22;
/** Extra height directly under the cursor, falling off over ~SIGMA bars either side. */
const CURSOR_SWELL = 0.4;
const SIGMA = 3;

/** Opacity of a stretch: at rest, when it is the one being attended to, and when it is not. */
const REST = 0.5;
const LIT = 0.95;
const RECEDED = 0.16;

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

/** Sixty bars at full float precision is kilobytes of markup below a pixel of difference. */
function round(value: number): number {
  return Math.round(value * 100) / 100;
}

function patternId(id: string): string {
  // Spotify ids are base62, so this is always a valid CSS identifier for `url(#…)`.
  return `trace-art-${id}`;
}

export function Trace({ tracks }: { tracks: TraceTrack[] }) {
  const reduced = useReducedMotion();
  const finePointer = useHasFinePointer();

  /** Hovered or focused: a preview, which reverts. */
  const [attending, setAttending] = useState<number | null>(null);
  /** Chosen: the track whose player is open. Survives the cursor leaving. */
  const [chosen, setChosen] = useState<number | null>(null);
  /** Latched once the strip has been scrolled to, and gates the album art requests. */
  const [seen, setSeen] = useState(false);
  /** Live, unlike `seen`: the idle animation is not worth a frame while nobody is looking. */
  const [inView, setInView] = useState(false);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const barRefs = useRef<Array<SVGGElement | null>>([]);
  const applied = useRef<number[]>([]);
  const target = useRef({ index: 0, strength: 0 });
  const current = useRef({ index: 0, strength: 0 });
  const frame = useRef(0);
  const running = useRef(false);

  const perTrack = tracks[0]?.shape.length ?? 0;
  const totalBars = tracks.length * perTrack;
  const stretchWidth = perTrack * PITCH;
  const width = totalBars * PITCH;

  const active = attending ?? chosen;

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.some((entry) => entry.isIntersecting);
        setInView(visible);
        // Latches: once the art has been requested there is nothing to undo by leaving.
        if (visible) setSeen(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  const start = useCallback(() => {
    if (running.current) return;
    running.current = true;

    const step = () => {
      const to = target.current;
      const at = current.current;

      at.strength += (to.strength - at.strength) * 0.14;
      at.index += (to.index - at.index) * 0.28;

      const nodes = barRefs.current;
      for (let i = 0; i < nodes.length; i += 1) {
        const node = nodes[i];
        if (!node) continue;

        const distance = i - at.index;
        const falloff = Math.exp(-(distance * distance) / (2 * SIGMA * SIGMA));
        const scale = 1 + CURSOR_SWELL * at.strength * falloff;

        // Skipping imperceptible changes is what keeps this to a handful of style writes
        // a frame rather than sixty: only the bars near the cursor are actually moving.
        if (Math.abs(scale - (applied.current[i] ?? 1)) < 0.004) continue;
        applied.current[i] = scale;

        const cx = i * PITCH + PITCH / 2;
        node.style.transform = `translate(${cx}px, ${CENTER}px) scale(1, ${scale}) translate(${-cx}px, ${-CENTER}px)`;
      }

      if (to.strength === 0 && at.strength < 0.004) {
        at.strength = 0;
        for (let i = 0; i < nodes.length; i += 1) {
          const node = nodes[i];
          if (node) node.style.transform = "";
          applied.current[i] = 1;
        }
        running.current = false;
        frame.current = 0;
        return;
      }

      frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);
  }, []);

  const stretchUnder = useCallback(
    (event: React.PointerEvent<HTMLDivElement>): number | null => {
      const rect = event.currentTarget.getBoundingClientRect();
      if (rect.width === 0) return null;

      const ratio = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      target.current.index = ratio * (totalBars - 1);
      return Math.min(tracks.length - 1, Math.floor(ratio * tracks.length));
    },
    [tracks.length, totalBars],
  );

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    // Touch gets the list below, not a hover state it cannot leave.
    if (event.pointerType === "touch") return;

    const stretch = stretchUnder(event);
    if (stretch === null) return;

    setAttending(stretch);
    if (reduced) return;
    target.current.strength = 1;
    start();
  };

  const onPointerLeave = () => {
    setAttending(null);
    target.current.strength = 0;
    if (!reduced) start();
  };

  const onStripClick = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const stretch = stretchUnder(event);
    if (stretch !== null) setChosen(stretch);
  };

  const playing = chosen === null ? null : tracks[chosen];
  const linked = tracks[active ?? 0];
  const playerId = "soundtrack-player";

  return (
    <div>
      <div
        ref={wrapRef}
        onPointerMove={finePointer ? onPointerMove : undefined}
        onPointerLeave={finePointer ? onPointerLeave : undefined}
        onPointerDown={finePointer ? onStripClick : undefined}
        className={cn("relative", finePointer && "cursor-pointer")}
      >
        {/*
          aria-hidden, unlike the drawn fallback: everything this says is said properly by
          the list below it, and a screen reader gains nothing from being told the shape of
          a waveform twice.
        */}
        <svg
          aria-hidden
          viewBox={`0 0 ${width} ${H}`}
          preserveAspectRatio="none"
          className="h-28 w-full touch-pan-y select-none md:h-40"
        >
          <defs>
            {seen
              ? tracks.map((track, stretch) =>
                  track.art ? (
                    <pattern
                      key={track.id}
                      id={patternId(track.id)}
                      patternUnits="userSpaceOnUse"
                      x={stretch * stretchWidth}
                      y={0}
                      width={stretchWidth}
                      height={H}
                    >
                      <image
                        href={track.art}
                        x={0}
                        y={0}
                        width={stretchWidth}
                        height={H}
                        preserveAspectRatio="xMidYMid slice"
                      />
                    </pattern>
                  ) : null,
                )
              : null}
          </defs>

          <g
            className={inView ? "motion-safe:animate-trace" : undefined}
            style={{ transformOrigin: `${width / 2}px ${CENTER}px` }}
          >
            {tracks.map((track, stretch) => {
              const lit = active === stretch;
              const cx = stretch * stretchWidth + stretchWidth / 2;

              return (
                <g
                  key={track.id}
                  style={{
                    opacity: active === null ? REST : lit ? LIT : RECEDED,
                    transform: lit
                      ? `translate(${cx}px, ${CENTER}px) scale(1, ${STRETCH_SWELL}) translate(${-cx}px, ${-CENTER}px)`
                      : undefined,
                  }}
                  className={cn(
                    "transition-[opacity,transform]",
                    reduced ? "duration-150" : "duration-[var(--dur-slow)] ease-[var(--ease-out-expo)]",
                  )}
                >
                  {track.shape.map((height, index) => {
                    const bar = stretch * perTrack + index;
                    const barHeight = round(height * MAX_BAR_H);
                    const x = round(bar * PITCH + (PITCH - BAR_W) / 2);
                    const y = round(CENTER - barHeight / 2);
                    const weight = round(0.4 + height * 0.5);

                    return (
                      <g
                        key={index}
                        ref={(node) => {
                          barRefs.current[bar] = node;
                        }}
                      >
                        <rect
                          x={x}
                          y={y}
                          width={BAR_W}
                          height={barHeight}
                          rx={BAR_W / 2}
                          className="fill-accent-dim"
                          style={{ opacity: weight }}
                        />
                        {seen && track.art ? (
                          <rect
                            x={x}
                            y={y}
                            width={BAR_W}
                            height={barHeight}
                            rx={BAR_W / 2}
                            fill={`url(#${patternId(track.id)})`}
                            style={{ opacity: lit ? 1 : 0 }}
                            className={cn(
                              "transition-opacity",
                              reduced ? "duration-150" : "duration-[var(--dur-slow)]",
                            )}
                          />
                        ) : null}
                      </g>
                    );
                  })}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/*
        The real controls. Three columns on a wide screen, aligned under their own stretch
        of the waveform; three rows on a narrow one, where three columns would put four
        words on four lines each. All three are always present — the section is three
        tracks, and hiding two behind an interaction would make it one.
      */}
      <ul className="mt-5 grid grid-cols-1 gap-px md:grid-cols-3">
        {tracks.map((track, stretch) => {
          const lit = active === stretch;

          return (
            <li key={track.id}>
              <button
                type="button"
                aria-expanded={chosen === stretch}
                aria-controls={playerId}
                onClick={() => setChosen(stretch)}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "touch") setAttending(stretch);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType !== "touch") setAttending(null);
                }}
                onFocus={() => setAttending(stretch)}
                onBlur={() => setAttending(null)}
                className={cn(
                  "group w-full border-t pt-3 text-left transition-colors duration-300 outline-none",
                  "focus-visible:border-accent",
                  lit ? "border-accent/70" : "border-line/50",
                )}
              >
                <span
                  className={cn(
                    "font-mono text-[0.625rem] tracking-[0.2em] tabular-nums transition-colors duration-300",
                    lit ? "text-accent" : "text-fg-faint",
                  )}
                >
                  {String(stretch + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-1.5 block font-serif text-lg leading-snug font-light text-balance transition-colors duration-300",
                    lit ? "text-fg-strong" : "text-fg-muted",
                  )}
                >
                  {track.title}
                </span>
                <span
                  className={cn(
                    "mt-0.5 block text-sm transition-colors duration-300",
                    lit ? "text-fg-muted" : "text-fg-faint",
                  )}
                >
                  {track.artists}
                </span>
                <span className="sr-only">
                  {soundtrack.selectHint} {track.title}, {track.artists}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/*
        Spotify's own embed, which is the only sanctioned way to play a full track in a
        page, and only after someone has asked for one. It is not the section — the section
        is above it — and it is not mounted until a track is chosen, so the resting state
        costs no third-party iframe.
      */}
      <div id={playerId}>
        {playing ? (
          <div className="mt-6 overflow-hidden rounded-xl border border-line/60 bg-bg-raised/40">
            <iframe
              key={playing.id}
              title={`${soundtrack.playerTitle} — ${playing.title}`}
              src={`https://open.spotify.com/embed/track/${playing.id}?utm_source=generator&theme=0`}
              width="100%"
              height={80}
              loading="lazy"
              allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              style={{ border: 0, display: "block" }}
            />
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p className="font-mono text-[0.625rem] tracking-[0.2em] text-fg-faint uppercase">
          {soundtrack.source}
        </p>
        <a
          href={linked.url}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-[0.625rem] tracking-[0.2em] text-fg-faint uppercase transition-colors duration-200 hover:text-accent focus-visible:text-accent"
        >
          {soundtrack.open} ↗
        </a>
      </div>
    </div>
  );
}
