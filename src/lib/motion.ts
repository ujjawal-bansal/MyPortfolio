/**
 * One pace for the whole page.
 *
 * Every section used to choose its own timing — 0.4s here, 0.55 there, a bounce on the
 * journey's points and the stack's markers — so scrolling felt like moving between rooms
 * built by different people. These are the only speeds scroll-driven motion on the site
 * uses now, and they are named for what the motion *is*, not how long it takes.
 *
 * The register is calm: things arrive and settle; nothing overshoots, nothing hurries.
 * Durations scale with what is moving — a small mark settles quicker than a paragraph
 * arrives — and anything with a label waits for its mark, so the eye is never asked to
 * read two arrivals at once. Out-eases for arrivals, but gentle ones (power2, not
 * power3): a hard-braking ease starts so fast that the first frames read as a jump, which
 * is what made scrolling in feel rushed. In-out only for a line being drawn, where the pen
 * should start and finish softly.
 *
 * CSS transitions have their own tokens in globals.css (`--dur-*`, `--ease-*`); this is
 * the GSAP half of the same system, and the two agree on feel.
 */

/** Content entering: a block, a paragraph, a row. */
export const REVEAL = { duration: 1.2, ease: "power2.out" } as const;

/** How far a block travels as it enters. Enough to be felt, not enough to be watched. */
export const RISE = 14;

/** Between siblings entering together. */
export const STAGGER = 0.12;

/** Small marks — a point on a timeline, a marker on a list — settling into place. No bounce. */
export const MARK = { duration: 1, ease: "power2.out" } as const;

/** A line being drawn: a strike-through, a rule. Starts and ends softly. */
export const DRAW = { duration: 0.9, ease: "power2.inOut" } as const;

/**
 * Where a section's motion begins: as it enters the lower edge of the viewport. A touch
 * earlier than it used to, because arrivals now take longer and should have landed by the
 * time the reader's eye gets there.
 */
export const TRIGGER = "top 88%";

/** A mark lands, then its words follow: the beat between them. */
export const FOLLOW = "<0.25";
