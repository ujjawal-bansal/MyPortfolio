/**
 * Builds the portrait print from its source image.
 *
 *   node scripts/portrait/build.mjs
 *
 * Reads `scripts/portrait/source.jpg`, writes `src/assets/portrait.webp`. Run it again
 * whenever the source changes; the output is committed, so the site never runs this.
 *
 * Uses `sharp`, which Next already installs for image optimisation — no new dependency.
 *
 * ## What it is trying to make
 *
 * Not a filtered headshot. A small print that has existed for a while: taken in a booth,
 * printed, kept in a notebook, scanned. So the treatment is a sequence of the things that
 * happen to a photograph, in the order they happen, each one light:
 *
 *   1. Cropped square on the head, for a print that is cut into a circle.
 *   2. Printed and re-scanned — halved and restored, which softens the way optics do
 *      rather than the way a blur filter does.
 *   3. Rendered on orthochromatic-leaning stock: red weighs more, so warm tones — marble,
 *      the light falling on it — lift, and cool shadow sinks toward the ink.
 *   4. Exposed for the print, the way a darkroom sets exposure per negative: the source's
 *      tones are stretched so its brightest part reaches paper and its darkest the ink.
 *      Without this a low-key source (a statue against black) prints as mud, and a
 *      bright one blows out. Then faded — blacks lifted, whites held below paper-white.
 *   5. Grain, clumped and strongest in the midtones, as it is in film.
 *   6. Handled — the edges burn darker first; the paper mottles; one faint band where a
 *      scanner lamp ran unevenly.
 *   7. Printed in two plates that did not quite register: the warm plate sits a fraction
 *      of a pixel off the ink, which shows only as a trace along the hair.
 *   8. Cut out by hand: a circle that is almost, but not quite, true.
 *
 * Every random choice is seeded. Rebuilding produces the same file, byte for byte.
 *
 * What it deliberately leaves to CSS: the light. The print is lit from the side facing
 * the site's dot, and that gradient lives in the component so hovering can bring the
 * whole print into it.
 */

import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SOURCE = fileURLToPath(new URL("./source.jpg", import.meta.url));
const OUTPUT = fileURLToPath(new URL("../../src/assets/portrait.webp", import.meta.url));

/** Twice the widest the print is ever shown (~280px), with room for 3× screens to borrow. */
const WIDTH = 640;
const HEIGHT = WIDTH;

/** Warm ink, a grey-umber middle, and aged paper. Not sepia: sepia is a filter's colour. */
const INK = "#1a1714";
const MID = "#5b5248";
const PAPER = "#ddd3bf";

/* ---------------------------------------------------------------- helpers ----------- */

function generator(seed) {
  let x = seed >>> 0 || 1;
  return () => {
    x ^= x << 13;
    x >>>= 0;
    x ^= x >>> 17;
    x ^= x << 5;
    x >>>= 0;
    return x / 4294967296;
  };
}

function gaussian(random) {
  let u = 0;
  let v = 0;
  while (u === 0) u = random();
  while (v === 0) v = random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const lerp = (a, b, t) => a + (b - a) * t;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const smooth = (t) => t * t * (3 - 2 * t);

/** Value noise on a coarse lattice, smoothly interpolated: slow, soft variation. */
function valueNoise(width, height, cell, random) {
  const cols = Math.ceil(width / cell) + 2;
  const rows = Math.ceil(height / cell) + 2;
  const lattice = Float32Array.from({ length: cols * rows }, () => random() * 2 - 1);
  const out = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    const gy = y / cell;
    const y0 = Math.floor(gy);
    const ty = smooth(gy - y0);
    for (let x = 0; x < width; x++) {
      const gx = x / cell;
      const x0 = Math.floor(gx);
      const tx = smooth(gx - x0);
      const a = lattice[y0 * cols + x0];
      const b = lattice[y0 * cols + x0 + 1];
      const c = lattice[(y0 + 1) * cols + x0];
      const d = lattice[(y0 + 1) * cols + x0 + 1];
      out[y * width + x] = lerp(lerp(a, b, tx), lerp(c, d, tx), ty);
    }
  }
  return out;
}

/* ---------------------------------------------------------------- 1–2 --------------- */

// The source is a marble head, 1024×1536, lit from the upper right against black. An
// 820px square from the left edge, 120px down, sets the face left of centre with its gaze
// going up toward the light, lets the shafts cross the top of the round, and closes the
// bottom on the drape at the shoulder. Centring the face flattened that: the look needs
// room to go somewhere.
const cropWidth = 820;
const cropHeight = 820;
const cropLeft = 0;
const cropTop = 120;

const scanned = await sharp(SOURCE)
  .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
  .resize(Math.round(WIDTH * 0.55), Math.round(HEIGHT * 0.55), { kernel: "lanczos3" })
  .resize(WIDTH, HEIGHT, { kernel: "cubic" })
  .blur(0.7)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { data, info } = scanned;
const W = info.width;
const H = info.height;
const N = W * H;
const channels = info.channels;

/* ---------------------------------------------------------------- 3–4 --------------- */

const luminance = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const r = data[i * channels];
  const g = data[i * channels + 1];
  const b = data[i * channels + 2];
  luminance[i] = (0.52 * r + 0.38 * g + 0.1 * b) / 255;
}

// Exposure: map the 1st–99.6th percentile of the source's tones onto the full range. The
// percentiles, not the extremes, so one specular glint or one dead pixel cannot set the
// exposure for the whole print.
{
  const sorted = Float32Array.from(luminance).sort();
  const low = sorted[Math.floor(N * 0.01)];
  const high = sorted[Math.floor(N * 0.996)];
  const span = Math.max(1e-3, high - low);
  for (let i = 0; i < N; i++) luminance[i] = clamp01((luminance[i] - low) / span);
}

const fade = (v) => lerp(0.1, 0.93, lerp(v, smooth(v), 0.35));

/* ---------------------------------------------------------------- 5–6 --------------- */

const random = generator(21);
const white = Float32Array.from({ length: N }, () => gaussian(random));
const grain = new Float32Array(N);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    let sum = 0;
    let weight = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const w = dx === 0 && dy === 0 ? 2 : 1;
        sum += white[yy * W + xx] * w;
        weight += w;
      }
    }
    grain[y * W + x] = sum / weight;
  }
}

const mottle = valueNoise(W, H, 90, generator(7));
const bandCentre = H * 0.63;
const bandWidth = H * 0.05;

/* ---------------------------------------------------------------- 7 ----------------- */

const ink = rgb(INK);
const mid = rgb(MID);
const paper = rgb(PAPER);
const ramp = (t, k) =>
  t < 0.55 ? lerp(ink[k], mid[k], t / 0.55) : lerp(mid[k], paper[k], (t - 0.55) / 0.45);

/** The finished tone at a pixel, before colour. Sampled twice for the misregistered plate. */
function toneAt(x, y) {
  const xi = Math.min(W - 1, Math.max(0, Math.round(x)));
  const yi = Math.min(H - 1, Math.max(0, Math.round(y)));
  const i = yi * W + xi;
  let v = fade(luminance[i]);
  v += grain[i] * 0.055 * (0.35 + 1.3 * v * (1 - v));
  v += mottle[i] * 0.018;
  v += 0.014 * Math.exp(-(((yi - bandCentre) / bandWidth) ** 2));
  // A round print burns toward its rim: the edge is what the fingers held.
  const nx = xi / W - 0.5;
  const ny = yi / H - 0.5;
  const reach = Math.sqrt(nx * nx + ny * ny) / 0.5;
  v *= 1 - 0.2 * Math.pow(clamp01((reach - 0.55) / 0.45), 1.8);
  return clamp01(v);
}

/* ---------------------------------------------------------------- 8 ----------------- */

// A circle cut by hand: the radius wanders by about a pixel as it goes round, on a slow
// noise, then feathers over one. Any more and it reads as torn; any less and it reads as
// a CSS border-radius, which is the thing this is trying not to be.
const cut = generator(3);
const LOBES = 11;
const lobes = Array.from({ length: LOBES }, () => cut() * 2 - 1);
const radiusAt = (angle) => {
  const g = ((angle + Math.PI) / (2 * Math.PI)) * LOBES;
  const i = Math.floor(g) % LOBES;
  return W / 2 - 3 + lerp(lobes[i], lobes[(i + 1) % LOBES], smooth(g - Math.floor(g))) * 1.2;
};

const pixels = Buffer.alloc(N * 4);
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = y * W + x;
    const t = toneAt(x, y);
    // The warm plate, 1.5px down and right of the ink: only visible where tone changes fast.
    const shifted = toneAt(x - 1.5, y - 1);
    pixels[i * 4] = Math.round(lerp(ramp(t, 0), ramp(shifted, 0), 0.6));
    pixels[i * 4 + 1] = Math.round(ramp(t, 1));
    pixels[i * 4 + 2] = Math.round(ramp(t, 2));

    const dx = x + 0.5 - W / 2;
    const dy = y + 0.5 - H / 2;
    const inside = radiusAt(Math.atan2(dy, dx)) - Math.sqrt(dx * dx + dy * dy);
    pixels[i * 4 + 3] = Math.round(255 * clamp01(inside + 0.5));
  }
}

const result = await sharp(pixels, { raw: { width: W, height: H, channels: 4 } })
  .webp({ quality: 82, alphaQuality: 90, effort: 6, smartSubsample: true })
  .toFile(OUTPUT);

console.log(`portrait: ${result.width}×${result.height}, ${(result.size / 1024).toFixed(1)}kB → ${OUTPUT}`);
