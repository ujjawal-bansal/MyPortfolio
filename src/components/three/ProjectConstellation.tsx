"use client";

import { useEffect, useRef } from "react";
import type { Architecture } from "@/content/architecture";

/**
 * The project's own system, breathing faintly behind its story.
 *
 * The home page's particle scene is the whole journey — a point becomes a field, a
 * network, a system, and returns to a point. A case study should not replay that. What
 * it gets instead is the same shape at the scale of one project, drawn from that
 * project's real architecture:
 *
 * - Through the problem and the solution: one faint glowing point. A problem begins as
 *   a single thing.
 * - At "Architecture": the point blooms into this project's actual constellation — its
 *   own nodes, its own connections — as the section that describes them arrives.
 * - At the closing lesson: the whole system gathers back into one point. The lesson is
 *   the system, distilled.
 *
 * One → many → one, again, but specific to this page and far quieter than the home
 * page. Scroll drives it by writing SVG attributes directly — no React render per frame.
 * The server renders the first state (a single point), so nothing flashes on load.
 * Reduced motion shows the full system, still.
 */

const NODE_RADIUS = 3.5;

/** Hermite smoothstep: keeps the bloom from starting and stopping abruptly. */
function ease(t: number) {
  return t * t * (3 - 2 * t);
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

export function ProjectConstellation({ architecture }: { architecture: Architecture }) {
  const { nodes, edges, width, height } = architecture;
  const cx = width / 2;
  const cy = height / 2;

  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const edgeRefs = useRef<(SVGLineElement | null)[]>([]);
  const edgeGroup = useRef<SVGGElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const index = new Map(nodes.map((n, i) => [n.id, i]));

    /** spread 0 = one point at the centre; 1 = the full system. */
    const apply = (spread: number) => {
      const s = ease(clamp01(spread));
      const positions = nodes.map((n) => ({ x: cx + (n.x - cx) * s, y: cy + (n.y - cy) * s }));

      positions.forEach((p, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        el.setAttribute("cx", p.x.toFixed(2));
        el.setAttribute("cy", p.y.toFixed(2));
      });

      edges.forEach((edge, i) => {
        const el = edgeRefs.current[i];
        const a = positions[index.get(edge.from) ?? -1];
        const b = positions[index.get(edge.to) ?? -1];
        if (!el || !a || !b) return;
        el.setAttribute("x1", a.x.toFixed(2));
        el.setAttribute("y1", a.y.toFixed(2));
        el.setAttribute("x2", b.x.toFixed(2));
        el.setAttribute("y2", b.y.toFixed(2));
      });

      // Connections only exist once there is something to connect.
      edgeGroup.current?.setAttribute("opacity", s.toFixed(3));
      // The single point glows; as it becomes a system the glow hands over to the nodes.
      glowRef.current?.setAttribute("opacity", (1 - s).toFixed(3));
    };

    /**
     * Bloom as "Architecture" reaches the reading line; gather back as the closing lesson
     * arrives, completing at the bottom of the page. Tied to the sections themselves
     * rather than to raw scroll %, because a long problem statement should not steal the
     * bloom — and the technical depth in between keeps the whole system in view.
     */
    const fromScroll = () => {
      const system = document.getElementById("architecture");
      const learned = document.getElementById("takeaway");
      const viewportBottom = window.scrollY + window.innerHeight;
      const docBottom = document.documentElement.scrollHeight;

      if (!system || !learned) {
        apply(1);
        return;
      }

      const systemTop = system.getBoundingClientRect().top + window.scrollY;
      const learnedTop = learned.getBoundingClientRect().top + window.scrollY;

      // Keyed to the middle of the screen, where reading happens — not the bottom edge,
      // which let the bloom start while the visitor was still on "The idea".
      const readingLine = window.scrollY + window.innerHeight * 0.55;
      const bloom = clamp01((readingLine - systemTop) / (window.innerHeight * 0.45));
      const gather = clamp01((viewportBottom - learnedTop) / Math.max(1, docBottom - learnedTop));
      apply(bloom * (1 - gather));
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const onScroll = () => {
      if (reduce.matches || frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        fromScroll();
      });
    };
    // Read the media query directly rather than through a hook: a hook's server snapshot
    // would briefly report "reduced", flashing the full system before collapsing it.
    const sync = () => (reduce.matches ? apply(1) : fromScroll());

    sync();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    reduce.addEventListener("change", sync);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduce.removeEventListener("change", sync);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [nodes, edges, cx, cy]);

  return (
    <div
      aria-hidden
      data-neti-layer="field"
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden md:justify-end md:pr-24"
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-[150vw] max-w-none opacity-25 motion-safe:animate-breathe md:w-[min(1000px,68vw)] md:opacity-40"
      >
        <defs>
          <radialGradient id="constellation-glow">
            <stop offset="0%" style={{ stopColor: "var(--dot)", stopOpacity: 0.9 }} />
            <stop offset="18%" style={{ stopColor: "var(--dot)", stopOpacity: 0.35 }} />
            <stop offset="100%" style={{ stopColor: "var(--dot)", stopOpacity: 0 }} />
          </radialGradient>
        </defs>

        {/* The single point. Rendered first, so it sits beneath the system it becomes. */}
        <circle ref={glowRef} cx={cx} cy={cy} r={34} fill="url(#constellation-glow)" />

        {/* Server state is spread 0: every line collapsed onto the centre, invisible. */}
        <g ref={edgeGroup} opacity={0}>
          {edges.map((edge, i) => (
            <line
              key={`${edge.from}-${edge.to}`}
              ref={(el) => {
                edgeRefs.current[i] = el;
              }}
              x1={cx}
              y1={cy}
              x2={cx}
              y2={cy}
              className="stroke-fg-faint"
              strokeOpacity={0.35}
              strokeWidth={1}
              strokeDasharray={edge.dashed ? "4 5" : undefined}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </g>

        {nodes.map((node, i) => (
          <circle
            key={node.id}
            ref={(el) => {
              nodeRefs.current[i] = el;
            }}
            cx={cx}
            cy={cy}
            r={NODE_RADIUS}
            className="fill-accent-dim"
          />
        ))}
      </svg>
    </div>
  );
}
