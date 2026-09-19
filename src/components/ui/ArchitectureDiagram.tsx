"use client";

import { useId, useRef } from "react";
import { gsap } from "gsap";
import type { Architecture, DiagramEdge, DiagramNode, NodeKind } from "@/content/architecture";
import { useMotionEffect } from "@/hooks";
import { cn } from "@/lib/utils";

/**
 * Architecture as inline SVG, drawn from the data in `src/content/architecture.ts`.
 *
 * Two variants share one source of truth:
 * - `full` is the labelled diagram on a case-study page.
 * - `mini` is the unlabelled constellation on the home page — the same system, reduced
 *   to points and lines, which is how a project announces itself before you open it.
 *
 * Accessibility: an SVG of boxes is meaningless to a screen reader, so the same
 * structure is also emitted as a visually hidden list of connections. Nobody should
 * have to infer an architecture from `<rect>` elements.
 */

const NODE = {
  full: { w: 132, h: 48, radius: 6 },
  mini: { w: 9, h: 9, radius: 9 },
} as const;

const KIND_CLASS: Record<NodeKind, string> = {
  client: "stroke-parchment-dim",
  service: "stroke-amber",
  gate: "stroke-blue-bright",
  data: "stroke-forest-bright",
  external: "stroke-brown",
};

const KIND_FILL: Record<NodeKind, string> = {
  client: "fill-parchment-dim",
  service: "fill-amber",
  gate: "fill-blue-bright",
  data: "fill-forest-bright",
  external: "fill-brown",
};

/** Clip a centre-to-centre line to each node's box, so edges stop at the border. */
function clipToBox(
  from: { x: number; y: number },
  to: { x: number; y: number },
  halfW: number,
  halfH: number,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return { from, to };

  const scale = (vx: number, vy: number) => {
    const sx = vx === 0 ? Infinity : halfW / Math.abs(vx);
    const sy = vy === 0 ? Infinity : halfH / Math.abs(vy);
    return Math.min(sx, sy);
  };

  const tStart = scale(dx, dy);
  const tEnd = scale(dx, dy);
  return {
    from: { x: from.x + dx * tStart, y: from.y + dy * tStart },
    to: { x: to.x - dx * tEnd, y: to.y - dy * tEnd },
  };
}

function edgePath(
  edge: DiagramEdge,
  nodes: readonly DiagramNode[],
  half: { w: number; h: number },
): { d: string; mid: { x: number; y: number } } | null {
  const a = nodes.find((n) => n.id === edge.from);
  const b = nodes.find((n) => n.id === edge.to);
  if (!a || !b) return null;

  const { from, to } = clipToBox(a, b, half.w, half.h);

  if (edge.curve) {
    // Perpendicular offset, so a bent edge clears whatever sits between the two nodes.
    const mx = (from.x + to.x) / 2;
    const my = (from.y + to.y) / 2;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const length = Math.hypot(dx, dy) || 1;
    const cx = mx + (-dy / length) * edge.curve;
    const cy = my + (dx / length) * edge.curve;
    return {
      d: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`,
      mid: { x: (mx + cx) / 2, y: (my + cy) / 2 },
    };
  }

  return {
    d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
    mid: { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 },
  };
}

export function ArchitectureDiagram({
  architecture,
  variant = "full",
  className,
}: {
  architecture: Architecture;
  variant?: "full" | "mini";
  className?: string;
}) {
  const scope = useRef<HTMLDivElement>(null);
  const markerId = useId().replace(/:/g, "");
  const { nodes, edges, width, height } = architecture;
  const box = NODE[variant];
  const half = { w: box.w / 2, h: box.h / 2 };

  useMotionEffect(scope, ({ selector }) => {
    const svg = selector("svg")[0];
    if (!svg) return;

    const paths = selector("[data-edge]");
    const nodeEls = selector("[data-node]");
    const labels = selector("[data-edge-label]");

    const timeline = gsap.timeline({
      scrollTrigger: { trigger: svg, start: "top 80%", once: true },
    });

    if (variant === "mini") {
      // The dot becoming a system: everything starts at the centre and moves out.
      timeline
        .from(nodeEls, {
          x: (index, target: Element) => width / 2 - Number((target as SVGGElement).dataset.cx ?? width / 2),
          y: (index, target: Element) =>
            height / 2 - Number((target as SVGGElement).dataset.cy ?? height / 2),
          scale: 0.4,
          opacity: 0.2,
          transformOrigin: "center",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.05,
        })
        .from(paths, { opacity: 0, duration: 0.5, stagger: 0.03 }, "-=0.5");
      return;
    }

    // Full variant: the lines draw themselves, then the boxes arrive.
    for (const path of paths) {
      const length = (path as SVGPathElement).getTotalLength();
      timeline.fromTo(
        path,
        { strokeDasharray: length, strokeDashoffset: length },
        {
          strokeDashoffset: 0,
          duration: 0.8,
          ease: "power2.inOut",
          // Drawing a line means overwriting strokeDasharray with its length — which
          // destroys the "5 5" pattern that marks an edge as being on a timer. Clear
          // the inline values afterwards so the attribute takes over again.
          onComplete: () => gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" }),
        },
        "<0.08",
      );
    }
    timeline
      .from(nodeEls, { opacity: 0, y: 10, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0)
      .from(labels, { opacity: 0, duration: 0.4, stagger: 0.04 }, "-=0.3");
  });

  const description = edges
    .map((edge) => {
      const a = nodes.find((n) => n.id === edge.from)?.label ?? edge.from;
      const b = nodes.find((n) => n.id === edge.to)?.label ?? edge.to;
      return `${a} to ${b}${edge.label ? ` (${edge.label})` : ""}`;
    })
    .join("; ");

  return (
    <div ref={scope} className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full overflow-visible"
        role="img"
        aria-label={architecture.caption}
      >
        <defs>
          <marker
            id={`arrow-${markerId}`}
            viewBox="0 0 8 8"
            refX="7"
            refY="4"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 7 4 L 0 7 z" className="fill-fg-faint" />
          </marker>
        </defs>

        <g>
          {edges.map((edge) => {
            const path = edgePath(edge, nodes, half);
            if (!path) return null;
            return (
              <g key={`${edge.from}-${edge.to}`}>
                <path
                  data-edge
                  d={path.d}
                  fill="none"
                  className="stroke-fg-faint/70"
                  strokeWidth={variant === "mini" ? 1 : 1.25}
                  strokeDasharray={edge.dashed ? "5 5" : undefined}
                  markerEnd={variant === "full" ? `url(#arrow-${markerId})` : undefined}
                />
                {variant === "full" && edge.label ? (
                  <text
                    data-edge-label
                    x={path.mid.x}
                    y={path.mid.y - 6}
                    textAnchor="middle"
                    className="fill-fg-faint font-mono"
                    style={{ fontSize: 9, letterSpacing: "0.04em" }}
                  >
                    {edge.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </g>

        <g>
          {nodes.map((node) =>
            variant === "mini" ? (
              <g key={node.id} data-node data-cx={node.x} data-cy={node.y}>
                <circle cx={node.x} cy={node.y} r={4.5} className={cn(KIND_FILL[node.kind], "opacity-80")} />
              </g>
            ) : (
              <g key={node.id} data-node>
                <rect
                  x={node.x - half.w}
                  y={node.y - half.h}
                  width={box.w}
                  height={box.h}
                  rx={box.radius}
                  className={cn("fill-bg-raised", KIND_CLASS[node.kind])}
                  strokeWidth={1}
                />
                <text
                  x={node.x}
                  y={node.sub ? node.y - 2 : node.y + 4}
                  textAnchor="middle"
                  className="fill-fg-strong"
                  style={{ fontSize: 12 }}
                >
                  {node.label}
                </text>
                {node.sub ? (
                  <text
                    x={node.x}
                    y={node.y + 13}
                    textAnchor="middle"
                    className="fill-fg-faint font-mono"
                    style={{ fontSize: 8.5 }}
                  >
                    {node.sub}
                  </text>
                ) : null}
              </g>
            ),
          )}
        </g>
      </svg>

      {/* The same structure, for anyone not looking at it. */}
      <p className="sr-only">
        {architecture.caption} Connections: {description}.
      </p>
    </div>
  );
}
