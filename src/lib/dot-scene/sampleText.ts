/**
 * Turn a word into a cloud of points, by drawing it on an offscreen canvas and reading
 * back which pixels the glyphs actually covered.
 *
 * Sampling the rasterised text rather than parsing font outlines means it works with
 * whatever font is loaded, including Devanagari, with no font-parsing dependency.
 */

export interface Point {
  x: number;
  y: number;
}

export interface SampleOptions {
  word: string;
  /** Area the text should fit inside, in CSS pixels. */
  width: number;
  height: number;
  /** Roughly how many points to return. The sampler adapts its step to hit this. */
  target: number;
  font: string;
}

/**
 * @returns points centred on (0,0), so the caller can place the word anywhere without
 * re-sampling.
 */
export function sampleText({ word, width, height, target, font }: SampleOptions): Point[] {
  // Sampling at low resolution is both faster and produces a more even spread than
  // sampling at full size and throwing most of it away.
  const w = Math.max(64, Math.floor(width));
  const h = Math.max(32, Math.floor(height));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];

  // Fit the word to the box: measure at a reference size, then scale.
  const reference = 100;
  ctx.font = `${reference}px ${font}`;
  const measured = ctx.measureText(word);
  const widthRatio = (w * 0.92) / Math.max(1, measured.width);
  const fontSize = Math.max(12, Math.min(reference * widthRatio, h * 0.8));

  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // Semi-bold: thin strokes sample into broken dashes rather than letters.
  ctx.font = `600 ${fontSize}px ${font}`;
  ctx.fillText(word, w / 2, h / 2);

  const { data } = ctx.getImageData(0, 0, w, h);

  // Pick a step that lands near the requested point count, then clamp it. The upper
  // bound matters more than the estimate: once the step approaches a glyph's stroke
  // width, letters sample into disconnected dashes and the word stops being readable.
  const estimatedInk = w * h * 0.16;
  const step = Math.min(7, Math.max(2, Math.round(Math.sqrt(estimatedInk / Math.max(1, target)))));

  const points: Point[] = [];
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      // Alpha channel of pixel (x, y).
      if (data[(y * w + x) * 4 + 3] > 128) {
        points.push({ x: x - w / 2, y: y - h / 2 });
      }
    }
  }

  return points;
}
