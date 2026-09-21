/**
 * One pace for the whole page.
 *
 * Every section used to choose its own timing — 0.4s here, 0.55 there, a bounce on the
 * journey's points and the stack's markers — so scrolling felt like moving between rooms
 * built by different people. These are the only speeds scroll-driven motion on the site
 * uses now, and they are named for what the motion *is*, not how long it takes.
 *
 * The register is calm: things arrive and settle; nothing overshoots. Out-eases only for
 * arrivals (fast start, long quiet landing, which is what reads as smooth), in-out only
 * for a line being drawn, where the pen should start and finish gently.
 *
 * CSS transitions have their own tokens in globals.css (`--dur-*`, `--ease-*`); this is
 * the GSAP half of the same system, and the two agree on feel.
 */

/** Content entering: a block, a paragraph, a row. */
export const REVEAL = { duration: 0.8, ease: "power3.out" } as const;

/** How far a block travels as it enters. Enough to be felt, not enough to be watched. */
export const RISE = 16;

/** Between siblings entering together. */
export const STAGGER = 0.07;

/** Small marks — a point on a timeline, a marker on a list — settling into place. No bounce. */
export const MARK = { duration: 0.7, ease: "expo.out" } as const;

/** A line being drawn: a strike-through, a rule. Starts and ends softly. */
export const DRAW = { duration: 0.6, ease: "power2.inOut" } as const;

/** Where a section's motion begins: when it is a little way into the viewport. */
export const TRIGGER = "top 85%";
