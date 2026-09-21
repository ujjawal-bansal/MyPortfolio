/**
 * A waveform shape per track, derived from the track itself.
 *
 * The original waveform in `content/beyondCode.ts` was hand-shaped: forty-two numbers
 * chosen so the line rose and fell like something drawn rather than sampled. This keeps
 * that character but earns it per track, so the three stretches of the strip are visibly
 * different from one another without any of them looking generated.
 *
 * **Deterministic, and deliberately so.** The seed is the Spotify track id, so a song
 * always draws the same shape — the same trace on every render, every visitor, every
 * revalidation. That is not only an aesthetic point: the shape is computed on the server
 * and sent as markup, and anything random would hydrate differently than it rendered.
 *
 * It is not an analysis of the audio. Spotify's audio-features endpoint would give a real
 * one, but it needs a scope this app does not ask for, and a shape that claims to be the
 * song's own waveform when it is not would be a small lie told in a section about traces.
 * This is a signature derived from identity, which is what it looks like.
 */

/** Bars per track. Three stretches of twenty read as one strip, not three charts. */
export const BARS_PER_TRACK = 20;

/** The band the hand-drawn original occupies. Staying inside it keeps the family look. */
const MIN_HEIGHT = 0.14;
const MAX_HEIGHT = 0.92;

/** FNV-1a. Small, fast, and good enough to decorrelate two ids that differ by a character. */
function hash(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** xorshift32. A PRNG rather than `Math.random`, because the sequence has to be reproducible. */
function generator(seed: number): () => number {
  let x = seed || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 4294967296;
  };
}

function clamp(value: number, low: number, high: number): number {
  return Math.min(high, Math.max(low, value));
}

/**
 * Three sine waves at seeded frequencies, summed, then knocked slightly out of true.
 *
 * Summed sines are what keeps this from looking like noise: the result still rises and
 * falls in runs, the way a drawn line does. The jitter afterwards is what keeps it from
 * looking like a diagram — a perfectly smooth curve reads as a graph, not a waveform.
 *
 * The ends of each stretch are tapered so the three flow into one another. Not to zero:
 * a gap would turn one landscape into three panels. Just enough that the seams read as a
 * breath between songs rather than a cut.
 */
export function traceFor(seed: string, bars: number = BARS_PER_TRACK): number[] {
  const random = generator(hash(seed));

  const parts = Array.from({ length: 3 }, () => ({
    frequency: 0.7 + random() * 2.6,
    phase: random() * Math.PI * 2,
    amplitude: 0.35 + random() * 0.65,
  }));
  const total = parts.reduce((sum, part) => sum + part.amplitude, 0);

  const raw = Array.from({ length: bars }, (_, index) => {
    const t = bars === 1 ? 0.5 : index / (bars - 1);

    let value = 0;
    for (const part of parts) {
      value += part.amplitude * Math.sin(t * Math.PI * 2 * part.frequency + part.phase);
    }
    value = (value / total + 1) / 2;
    value += (random() - 0.5) * 0.14;

    // sin(pi*t) is 0 at both ends and 1 in the middle; the root flattens it into a plateau
    // with soft shoulders, so only the outermost few bars are pulled down.
    const shoulders = Math.sin(t * Math.PI) ** 0.3;
    return clamp(value, 0, 1) * (0.68 + 0.32 * shoulders);
  });

  // Normalised per track, so a song whose sines happened to cancel is not a flat line
  // next to two lively ones. Each stretch uses the full band; none dominates by accident.
  const low = Math.min(...raw);
  const high = Math.max(...raw);
  const span = high - low;

  return raw.map((value) => {
    const unit = span < 0.001 ? 0.5 : (value - low) / span;
    return MIN_HEIGHT + unit * (MAX_HEIGHT - MIN_HEIGHT);
  });
}
