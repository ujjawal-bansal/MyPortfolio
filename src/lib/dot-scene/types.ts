/**
 * The scene contract.
 *
 * Everything below is deliberately renderer-agnostic: the sections drive the scene
 * through `DotSceneHandle` and know nothing about canvas, particles or draw calls.
 * Swapping in a WebGL implementation later means writing a new `createScene` that
 * returns this same handle — no section component changes.
 */

/**
 * The ladder from BRIEF §4 and §13:
 * one point → thought → idea → abstraction → system → back to one point.
 */
export type Stage = "point" | "field" | "text" | "network" | "system" | "converge";

export interface DotSceneHandle {
  /** Jump to a stage. Particles ease toward the new targets rather than teleporting. */
  setStage: (stage: Stage) => void;
  /** Global scroll progress, 0 at the top of the page to 1 at the bottom. */
  setProgress: (progress: number) => void;
  /** Viewport coordinates, or null when the pointer leaves or the device is touch-only. */
  setPointer: (x: number | null, y: number | null) => void;
  /** Recompute for a new canvas size. Safe to call often; it debounces internally. */
  resize: () => void;
  pause: () => void;
  resume: () => void;
  destroy: () => void;
  /** Frames per second over the last second. Development instrumentation. */
  getFps: () => number;
  getStage: () => Stage;
}

export interface SceneColors {
  /** The dot itself. */
  dot: string;
  /** Ordinary particles. */
  particle: string;
  /** Network and system edges. */
  line: string;
  /** Used sparingly, for the single point and a few accents. */
  accent: string;
}

export interface DotSceneOptions {
  canvas: HTMLCanvasElement;
  /** Tuned per device by the React wrapper. */
  particleCount: number;
  /** Draws exactly one frame and never starts the loop. */
  reducedMotion: boolean;
  /** False for touch-only devices, which get idle drift instead. */
  pointerInfluence: boolean;
  /**
   * Thins the most expensive drawing. Set from `hardwareConcurrency`, which is the only
   * device-capability signal browsers actually expose.
   */
  lowPower: boolean;
  /** Sampled to produce the "idea" stage targets. */
  word: string;
  /**
   * A phone. The scene's loud moments — the glowing point at the hero, the cluster it
   * gathers into at the end — are placed at the centre of the viewport, which on a laptop
   * is open space beside the text and on a phone is always the text itself. Compact runs
   * the whole scene at about half presence with a smaller glow, and does not try to spell
   * the word: 240 particles across 390px make dust, not letters, sitting behind a list.
   * Simplified, not removed — the scene is still there, just no longer on the words.
   */
  compact?: boolean;
  /**
   * A fully resolved font stack, e.g. `'Newsreader', Georgia, serif`.
   * `ctx.font` cannot parse `var(--font-serif)`, so resolution happens in the caller.
   */
  fontFamily: string;
  colors: SceneColors;
}

/** A stage's slice of the page, in scroll progress. */
export interface StageWindow {
  stage: Stage;
  from: number;
  to: number;
}

/**
 * Where each stage sits on the page. Editing this re-times the whole narrative, which is
 * the point — Phase 7 hooks the ending by watching for `converge` rather than by
 * hard-coding a scroll offset anywhere.
 */
export const stageSchedule: readonly StageWindow[] = [
  { stage: "point", from: 0, to: 0.02 },
  { stage: "field", from: 0.02, to: 0.1 },
  { stage: "text", from: 0.1, to: 0.17 },
  { stage: "network", from: 0.17, to: 0.45 },
  { stage: "system", from: 0.45, to: 0.88 },
  { stage: "converge", from: 0.88, to: 1 },
];

export function stageForProgress(progress: number): Stage {
  for (const window of stageSchedule) {
    if (progress >= window.from && progress < window.to) return window.stage;
  }
  return stageSchedule[stageSchedule.length - 1].stage;
}

/**
 * How present the scene is at a given scroll position. Loud at the hero, quiet through
 * the middle so body text stays readable, loud again as everything returns to a point.
 */
export function opacityForProgress(progress: number): number {
  if (progress < 0.05) return 1;
  if (progress < 0.14) return 1 - ((progress - 0.05) / 0.09) * 0.78;
  if (progress < 0.82) return 0.22;
  if (progress < 0.9) return 0.22 + ((progress - 0.82) / 0.08) * 0.68;
  return 0.9;
}
