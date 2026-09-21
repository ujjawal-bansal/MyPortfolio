import { sampleText, type Point } from "./sampleText";
import {
  opacityForProgress,
  stageForProgress,
  type DotSceneHandle,
  type DotSceneOptions,
  type Stage,
} from "./types";

/** devicePixelRatio above 2 costs real fill rate and buys almost nothing here. */
const MAX_DPR = 2;

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** Where this particle wants to be, in CSS pixels. */
  tx: number;
  ty: number;
  /** Its resting position in the field stage — stable, so `field` looks the same twice. */
  fx: number;
  fy: number;
  size: number;
  /** Per-particle offsets so drift and spring never synchronise. */
  seed: number;
  /** Index of the network node this particle belongs to. */
  node: number;
}

interface Node {
  x: number;
  y: number;
}

export function createDotScene(options: DotSceneOptions): DotSceneHandle {
  const { canvas, reducedMotion, pointerInfluence, word, colors, fontFamily, lowPower } = options;
  const compact = options.compact === true;
  /** How present the scene is overall. See `compact` in DotSceneOptions. */
  const presence = compact ? 0.55 : 1;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("2D canvas context unavailable");

  let width = 0;
  let height = 0;
  let dpr = 1;

  let stage: Stage = "point";
  /** Drives the opacity curve; the spring itself handles easing between stages. */
  let alpha = presence;

  let pointerX: number | null = null;
  let pointerY: number | null = null;

  let running = false;
  let frame = 0;
  let lastTime = 0;
  let elapsed = 0;

  let fps = 0;
  let fpsFrames = 0;
  let fpsSince = 0;

  /**
   * The glow, pre-rendered once. `shadowBlur` is re-rasterised on every draw and was
   * measured costing ~4ms/frame on a throttled phone all by itself; a cached sprite
   * blitted with drawImage costs effectively nothing.
   */
  let glowSprite: HTMLCanvasElement | null = null;

  function buildGlowSprite() {
    const radius = compact ? 14 : lowPower ? 18 : 28;
    const sprite = document.createElement("canvas");
    sprite.width = radius * 2;
    sprite.height = radius * 2;
    const sc = sprite.getContext("2d");
    if (!sc) return;
    const gradient = sc.createRadialGradient(radius, radius, 0, radius, radius, radius);
    // A tight core with a fast falloff. A wide soft ramp reads as a smudge rather than
    // a point, which is the one thing this element must not do.
    gradient.addColorStop(0, colors.dot);
    gradient.addColorStop(0.1, colors.dot);
    gradient.addColorStop(0.32, "rgba(227, 172, 99, 0.28)");
    gradient.addColorStop(1, "transparent");
    sc.fillStyle = gradient;
    sc.fillRect(0, 0, radius * 2, radius * 2);
    // A hard centre so the point stays a point at any pixel ratio.
    sc.fillStyle = colors.dot;
    sc.beginPath();
    sc.arc(radius, radius, 1.75, 0, Math.PI * 2);
    sc.fill();
    glowSprite = sprite;
  }

  const particles: Particle[] = [];
  let nodes: Node[] = [];
  let nodeEdges: [number, number][] = [];
  let textPoints: Point[] = [];
  let nodeCount = 0;

  const count = Math.max(24, options.particleCount);

  /* ---------------------------------------------------------------------- */
  /*  Layout                                                                 */
  /* ---------------------------------------------------------------------- */

  function measure() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

    const pixelWidth = Math.floor(width * dpr);
    const pixelHeight = Math.floor(height * dpr);

    // Assigning width/height clears the canvas, so only do it when it actually changed.
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** Shared by target assignment and edge drawing, so the two cannot drift apart. */
  function latticeColumns() {
    return Math.max(4, Math.round(Math.sqrt(particles.length) * 1.4));
  }

  function buildNodes() {
    // Fewer nodes on small screens, so the graph reads as a graph rather than a mesh.
    nodeCount = Math.max(5, Math.min(11, Math.round(width / 150)));
    nodes = [];
    const radius = Math.min(width, height) * 0.32;
    for (let i = 0; i < nodeCount; i += 1) {
      // Golden-angle placement: even coverage without looking like a clock face.
      const angle = i * 2.399963;
      const r = radius * Math.sqrt((i + 0.6) / nodeCount);
      nodes.push({ x: width / 2 + Math.cos(angle) * r, y: height / 2 + Math.sin(angle) * r * 0.75 });
    }

    // Each node to its two nearest neighbours. Computed once per layout rather than
    // per frame — it is O(n² log n) and there is no reason to pay for it 60 times a second.
    nodeEdges = [];
    for (let i = 0; i < nodes.length; i += 1) {
      const a = nodes[i];
      const nearest = nodes
        .map((b, j) => ({ j, d: (b.x - a.x) ** 2 + (b.y - a.y) ** 2 }))
        .filter((entry) => entry.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2);
      for (const { j } of nearest) if (i < j) nodeEdges.push([i, j]);
    }
  }

  function buildTextPoints() {
    textPoints = sampleText({
      word,
      width: Math.min(width * 0.82, 980),
      height: Math.min(height * 0.36, 240),
      target: count,
      // A resolved family string. ctx.font cannot parse CSS var(), so the React
      // wrapper reads the computed value and hands it over already resolved.
      font: fontFamily,
    });
  }

  function buildParticles() {
    particles.length = 0;
    for (let i = 0; i < count; i += 1) {
      // Stable pseudo-random field position from the index — same layout every reload.
      const angle = i * 2.399963;
      const r = Math.sqrt((i + 0.5) / count);
      const fx = width / 2 + Math.cos(angle) * r * width * 0.46;
      const fy = height / 2 + Math.sin(angle) * r * height * 0.46;
      particles.push({
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
        tx: fx,
        ty: fy,
        fx,
        fy,
        size: 0.7 + ((i * 37) % 10) / 10,
        seed: (i * 127.1) % 1000,
        node: i % Math.max(1, nodeCount),
      });
    }
  }

  function layout() {
    measure();
    if (!glowSprite) buildGlowSprite();
    buildNodes();
    buildTextPoints();
    if (particles.length === 0) buildParticles();
    else {
      // Keep existing particles (and their momentum), just refresh their field homes.
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const angle = i * 2.399963;
        const r = Math.sqrt((i + 0.5) / particles.length);
        p.fx = width / 2 + Math.cos(angle) * r * width * 0.46;
        p.fy = height / 2 + Math.sin(angle) * r * height * 0.46;
        p.node = i % Math.max(1, nodeCount);
      }
    }
    assignTargets();
  }

  /* ---------------------------------------------------------------------- */
  /*  Targets per stage                                                      */
  /* ---------------------------------------------------------------------- */

  function assignTargets() {
    const cx = width / 2;
    const cy = height / 2;

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];

      switch (stage) {
        case "point":
        case "converge": {
          p.tx = cx;
          p.ty = cy;
          break;
        }
        case "field": {
          p.tx = p.fx;
          p.ty = p.fy;
          break;
        }
        case "text": {
          // A phone gets the field instead of a word it has too few particles to write.
          if (compact || textPoints.length === 0) {
            p.tx = p.fx;
            p.ty = p.fy;
          } else {
            // Stride across the whole sample, never a prefix. Points come back in
            // row-major order, so `i % length` would crowd every particle into the top
            // few rows of the word and leave its lower half empty.
            const point = textPoints[Math.floor((i * textPoints.length) / particles.length)];
            p.tx = cx + point.x;
            p.ty = cy + point.y;
          }
          break;
        }
        case "network": {
          // Cluster around a node, with a small stable offset so they do not stack.
          // Angle and radius use different hashes of the seed — sharing one makes every
          // cluster the same spiral, which reads as machinery rather than thought.
          const node = nodes[p.node] ?? { x: cx, y: cy };
          const angle = (p.seed * 0.0628) % (Math.PI * 2);
          const r = 10 + (((p.seed * 7.31) % 31) + (i % 5) * 3);
          p.tx = node.x + Math.cos(angle) * r;
          p.ty = node.y + Math.sin(angle) * r;
          break;
        }
        case "system": {
          // A lattice. Order out of the graph — code, structure, something buildable.
          const columns = latticeColumns();
          const rows = Math.ceil(particles.length / columns);
          const gapX = (width * 0.7) / columns;
          const gapY = (height * 0.55) / Math.max(1, rows);
          const col = i % columns;
          const row = Math.floor(i / columns);
          p.tx = cx - (columns - 1) * gapX * 0.5 + col * gapX;
          p.ty = cy - (rows - 1) * gapY * 0.5 + row * gapY;
          break;
        }
      }
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  Simulation                                                             */
  /* ---------------------------------------------------------------------- */

  function step(dt: number) {
    // Stages differ in how eagerly particles snap to their targets. `text` is tight so
    // the word is legible; `field` is loose so it breathes.
    const stiffness = stage === "text" ? 0.14 : stage === "system" ? 0.1 : 0.06;
    const damping = stage === "text" ? 0.78 : 0.86;
    const drift = stage === "field" || stage === "network" ? 1 : 0.25;

    const pointerActive = pointerInfluence && pointerX !== null && pointerY !== null;
    const pointerRadius = Math.min(width, height) * 0.22;

    for (const p of particles) {
      // Spring toward the target.
      let ax = (p.tx - p.x) * stiffness;
      let ay = (p.ty - p.y) * stiffness;

      // Idle drift — the field is never quite still, on touch devices especially.
      if (drift > 0) {
        const t = elapsed * 0.0004 + p.seed;
        ax += Math.cos(t * 1.7) * 0.05 * drift;
        ay += Math.sin(t * 1.3) * 0.05 * drift;
      }

      // The observer effect: particles yield around the cursor. Who is observing whom.
      if (pointerActive) {
        const dx = p.x - pointerX!;
        const dy = p.y - pointerY!;
        const distanceSq = dx * dx + dy * dy;
        if (distanceSq < pointerRadius * pointerRadius && distanceSq > 0.01) {
          const distance = Math.sqrt(distanceSq);
          const force = (1 - distance / pointerRadius) * 0.9;
          ax += (dx / distance) * force;
          ay += (dy / distance) * force;
        }
      }

      p.vx = (p.vx + ax) * damping;
      p.vy = (p.vy + ay) * damping;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  Drawing                                                                */
  /* ---------------------------------------------------------------------- */

  function drawEdges(c: CanvasRenderingContext2D, alpha: number) {
    if (stage !== "network" && stage !== "system") return;

    c.strokeStyle = colors.line;
    c.globalAlpha = alpha * (stage === "network" ? 0.5 : 0.28);
    c.lineWidth = 1;
    c.beginPath();

    if (stage === "network") {
      for (const [i, j] of nodeEdges) {
        c.moveTo(nodes[i].x, nodes[i].y);
        c.lineTo(nodes[j].x, nodes[j].y);
      }
    } else {
      // Orthogonal runs between lattice neighbours — circuitry, structure.
      // The lattice is the most expensive thing the scene draws, so on weak hardware
      // it thins to every other row. The structure still reads; the cost halves.
      const columns = latticeColumns();
      const rowStep = lowPower ? 2 : 1;
      for (let i = 0; i < particles.length; i += 1) {
        if (rowStep > 1 && Math.floor(i / columns) % rowStep !== 0) continue;
        const p = particles[i];
        const right = particles[i + 1];
        if (right && (i + 1) % columns !== 0) {
          c.moveTo(p.x, p.y);
          c.lineTo(right.x, right.y);
        }
      }
    }

    c.stroke();
  }

  function draw(alpha: number) {
    const c = ctx!;
    c.clearRect(0, 0, width, height);
    if (alpha <= 0.01) return;

    drawEdges(c, alpha);

    // One path for every particle, filled once. Nine hundred separate fill() calls is
    // the difference between 60fps and 30 on a mid-range phone.
    c.fillStyle = stage === "point" || stage === "converge" ? colors.accent : colors.particle;
    c.globalAlpha = alpha * (stage === "field" ? 0.75 : 0.9);
    c.beginPath();
    for (const p of particles) {
      c.moveTo(p.x + p.size, p.y);
      c.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    }
    c.fill();

    // The single point — the beginning, and the return to it.
    if ((stage === "point" || stage === "converge") && glowSprite) {
      c.globalAlpha = alpha;
      const r = glowSprite.width / 2;
      c.drawImage(glowSprite, width / 2 - r, height / 2 - r);
    }

    c.globalAlpha = 1;
  }

  /* ---------------------------------------------------------------------- */
  /*  Loop                                                                   */
  /* ---------------------------------------------------------------------- */

  function tick(time: number) {
    if (!running) return;
    frame = window.requestAnimationFrame(tick);

    // Normalise to 60fps steps, and clamp so a backgrounded tab does not explode on return.
    const delta = lastTime === 0 ? 16.67 : Math.min(time - lastTime, 50);
    lastTime = time;
    elapsed += delta;
    const dt = delta / 16.67;

    step(dt);
    draw(alpha);

    fpsFrames += 1;
    if (time - fpsSince >= 1000) {
      fps = Math.round((fpsFrames * 1000) / (time - fpsSince));
      fpsFrames = 0;
      fpsSince = time;
    }
  }

  /* ---------------------------------------------------------------------- */
  /*  Handle                                                                 */
  /* ---------------------------------------------------------------------- */

  let resizeTimer = 0;

  const handle: DotSceneHandle = {
    setStage(next) {
      if (next === stage) return;
      stage = next;
      assignTargets();
      if (reducedMotion) settleStatic();
    },

    /**
     * The normal driver. Derives both the stage and how present the scene should be, so
     * callers only have to know their scroll position. `setStage` stays available as an
     * override for Phase 7, which needs to force `converge` regardless of scroll.
     */
    setProgress(progress) {
      alpha = opacityForProgress(progress) * presence;
      handle.setStage(stageForProgress(progress));
    },

    setPointer(x, y) {
      pointerX = x;
      pointerY = y;
    },

    resize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        layout();
        if (reducedMotion) settleStatic();
      }, 120);
    },

    pause() {
      if (!running) return;
      running = false;
      window.cancelAnimationFrame(frame);
      lastTime = 0;
    },

    resume() {
      if (running || reducedMotion) return;
      running = true;
      lastTime = 0;
      fpsSince = performance.now();
      fpsFrames = 0;
      frame = window.requestAnimationFrame(tick);
    },

    destroy() {
      running = false;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      particles.length = 0;
    },

    getFps: () => fps,
    getStage: () => stage,
  };

  /**
   * Reduced motion: run the simulation forward with no rendering until it has settled,
   * then draw exactly one frame. The visitor gets the composition without the movement.
   */
  function settleStatic() {
    for (let i = 0; i < 220; i += 1) step(1);
    draw(alpha);
  }

  layout();
  if (reducedMotion) {
    settleStatic();
  }

  return handle;
}
