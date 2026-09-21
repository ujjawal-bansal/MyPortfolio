import type { CSSProperties } from "react";
import { wordPairs } from "@/content/fragments";

/**
 * Four words drifting around the hero's dot, each turning between a programming
 * keyword and the Sanskrit word that means the same thing — self · आत्मा,
 * observer · साक्षी, not · नेति, all · सर्वम्.
 *
 * Nothing is explained on screen, and nothing needs to be: watch one turn and back, and
 * the equivalence teaches itself. The turns are staggered in reading order, so over a
 * cycle the four play the neti neti path — self, witness, not this, the whole.
 *
 * Each pair shares a single grid cell, so the turn happens exactly in place. Under
 * reduced motion there is no turning: the two forms stack, which carries the same
 * meaning without any movement.
 *
 * `aria-hidden` — this is texture. The ideas are stated properly elsewhere on the page,
 * and a screen reader announcing "self, आत्मा, observer…" would be noise.
 */
export function Fragments() {
  return (
    <div aria-hidden data-loops className="pointer-events-none absolute inset-0 overflow-hidden">
      {wordPairs.map((pair) => (
        <span
          key={pair.code}
          // Phone positions by default, desktop positions from md. Custom properties keep
          // both in the content file rather than scattered through class names.
          className="absolute top-[var(--my)] left-[var(--mx)] block select-none motion-safe:animate-drift md:top-[var(--y)] md:left-[var(--x)]"
          style={
            {
              "--x": `${pair.x}%`,
              "--y": `${pair.y}%`,
              "--mx": `${pair.mx}%`,
              "--my": `${pair.my}%`,
              animationDuration: `${pair.drift}s`,
            } as CSSProperties
          }
        >
          <span className="grid place-items-center motion-reduce:flex motion-reduce:flex-col motion-reduce:items-start motion-reduce:gap-0.5">
            <span
              className="font-mono text-sm tracking-wide text-fg-faint/60 [grid-area:1/1] motion-safe:animate-turn-out"
              style={{ animationDelay: `${pair.delay}s` }}
            >
              {pair.code}
            </span>
            <span
              lang="sa"
              className="text-xl text-accent-dim [grid-area:1/1] motion-safe:animate-turn-in motion-safe:opacity-0"
              style={{ animationDelay: `${pair.delay}s` }}
            >
              {pair.devanagari}
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
