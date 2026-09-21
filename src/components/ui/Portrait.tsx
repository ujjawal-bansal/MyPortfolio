import Image from "next/image";
import print from "@/assets/portrait.webp";
import { portrait } from "@/content/portrait";

/**
 * The observed, seen through a lens.
 *
 * A small archival print, cut into a circle by hand, set inside two rings. The inner one
 * is a bare hairline. The outer one is text, engraved like the rim of a lens:
 * `साक्षी · the observed`, the witness and the witnessed, turning slowly round.
 *
 * The treatment itself is baked into the asset by `scripts/portrait/build.mjs`; what
 * lives here is how it sits, how it is lit, and how it moves.
 *
 * ## Light
 *
 * The print is lit from the upper left and falls off away from it, so it sits in the
 * page's low light rather than glowing out of it. Hovering brings the whole print into the
 * light and stills the ring: attention settles things.
 *
 * ## Motion
 *
 * The ring turns once every ninety seconds, slow enough to be noticed rather than watched,
 * and not at all under reduced motion. The reveal — the print developing out of a pale
 * veil as it scrolls in — belongs to the Self section's timeline, which is why the veil is
 * marked rather than animated here. Its resting opacity is zero, so without JavaScript or
 * motion the print is simply there.
 */

/**
 * Geometry, in the rings' 100-unit viewBox. The print is the centre 76% of the box — radius
 * 38, set by `inset-[12%]` below — so the hairline sits just clear of its edge and the text
 * just outside that.
 */
const HAIRLINE_R = 41.2;
const TEXT_R = 45.6;
const REPEATS = 4;

const ringPath = `M ${50 - TEXT_R},50 a ${TEXT_R},${TEXT_R} 0 1,1 ${TEXT_R * 2},0 a ${TEXT_R},${TEXT_R} 0 1,1 ${-TEXT_R * 2},0`;
const circumference = 2 * Math.PI * TEXT_R;

export function Portrait() {
  return (
    <figure
      data-portrait
      data-loops
      // The print is 76% of the box; the box is sized so the print is 200px on a phone and
      // 280px on a laptop, with the rings in the margin around it.
      className="group/portrait relative mx-auto aspect-square w-[16.5rem] lg:w-[23rem]"
    >
      {/* The print. Inset 12% so the rings have their margin. */}
      <div className="absolute inset-[12%] rounded-full shadow-[0_18px_36px_-18px_var(--print-shadow)]">
        <Image
          src={print}
          alt={portrait.alt}
          sizes="(min-width: 1024px) 280px, 200px"
          placeholder="blur"
          className="block size-full rounded-full"
        />

        {/*
          The light, from the upper left. Multiplied, so it deepens what is there rather
          than laying colour on it; clipped to the circle so it never darkens the page.
        */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_22%_20%,transparent_28%,rgb(0_0_0/0.18)_58%,rgb(0_0_0/0.52)_100%)] mix-blend-multiply transition-opacity duration-700 ease-[var(--ease-out-quart)] group-hover/portrait:opacity-25"
        />

        {/* The veil it develops out of, driven by the Self timeline. At rest: gone. */}
        <span
          aria-hidden
          data-portrait-veil
          className="pointer-events-none absolute inset-0 rounded-full bg-[#ddd3bf] opacity-0"
        />
      </div>

      {/* The hairline. Still, while the rim outside it turns. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="pointer-events-none absolute inset-0 size-full overflow-visible"
      >
        <circle
          cx={50}
          cy={50}
          r={HAIRLINE_R}
          fill="none"
          className="stroke-line-strong"
          strokeWidth={0.18}
        />
      </svg>

      {/*
        The engraved rim. Turns; stills on hover; does not turn at all without motion.

        The turning is on this wrapper, never on the SVG. Rotating the SVG itself made the
        browser lay out its curved text again on every frame — measured at 60 layouts a
        second and a fifth of the main thread, running even while the portrait was far
        off-screen. Rotating a plain box lets the text be drawn once and the GPU turn the
        result, which costs nothing per frame.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 group-hover/portrait:[animation-play-state:paused] motion-safe:animate-orbit"
      >
        <svg viewBox="0 0 100 100" className="size-full overflow-visible">
          <defs>
            <path id="portrait-rim" d={ringPath} />
          </defs>
          {/*
          Four engravings at exact quarters, each its own run of text, rather than one run
          stretched to close the circle. Stretching (`textLength`) adds space between every
          glyph, which is harmless in Latin and tears Devanagari apart: the conjunct and
          the vowel sign in साक्षी separate. Equal offsets keep the spacing even, the seam
          invisible, and every script shaped as it should be.
        */}
          {Array.from({ length: REPEATS }, (_, i) => (
            <text key={i} className="font-mono text-[3.1px] uppercase">
              <textPath href="#portrait-rim" startOffset={(circumference / REPEATS) * i}>
                {/* Letter-spacing stays at zero here: any tracking disables Devanagari shaping. */}
                <tspan className="fill-accent-dim font-devanagari text-[4.2px] tracking-normal normal-case">
                  {portrait.ring.witness}
                </tspan>
                <tspan className="fill-fg-ghost tracking-[0.32em]"> · {portrait.ring.observed} ·</tspan>
              </textPath>
            </text>
          ))}
        </svg>
      </div>
    </figure>
  );
}
