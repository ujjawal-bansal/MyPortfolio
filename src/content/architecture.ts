/**
 * Architecture diagrams, as data.
 *
 * Coordinates live in a 0–720 × 0–360 space and are hand-placed; the renderer scales
 * them. Keeping the diagrams as data rather than hand-written SVG means the draw-in
 * animation, the legend and the mobile layout are all written once.
 *
 * Every node and edge corresponds to something in docs/facts.md. Nothing here is
 * invented to make a diagram look busier than the system is.
 */

export type NodeKind = "client" | "service" | "data" | "external" | "gate";

export interface DiagramNode {
  id: string;
  label: string;
  /** Second line, e.g. a runtime or a host. Optional. */
  sub?: string;
  x: number;
  y: number;
  kind: NodeKind;
}

export interface DiagramEdge {
  from: string;
  to: string;
  label?: string;
  /** Dashed reads as "on a timer" — polling, cron. Solid is a direct call. */
  dashed?: boolean;
  /** Bends the edge; useful when a straight line would pass through a node. */
  curve?: number;
}

export interface Architecture {
  caption: string;
  width: number;
  height: number;
  nodes: readonly DiagramNode[];
  edges: readonly DiagramEdge[];
}

export const architectures: Record<string, Architecture> = {
  queuelite: {
    caption:
      "Three readers on three different clocks, one snapshot cache, one database that refuses duplicates.",
    width: 720,
    height: 360,
    nodes: [
      { id: "staff", label: "Staff desk", sub: "React · Vercel", x: 70, y: 60, kind: "client" },
      { id: "board", label: "Waiting board", sub: "React · Vercel", x: 70, y: 175, kind: "client" },
      { id: "patient", label: "Patient tracker", sub: "React · Vercel", x: 70, y: 290, kind: "client" },
      { id: "api", label: "Express API", sub: "Render", x: 330, y: 175, kind: "service" },
      { id: "cache", label: "Snapshot cache", sub: "2.5s coalescing", x: 510, y: 90, kind: "gate" },
      { id: "db", label: "PostgreSQL", sub: "Supabase · RLS", x: 620, y: 230, kind: "data" },
      { id: "cron", label: "Actions cron", sub: "keepalive", x: 330, y: 320, kind: "external" },
    ],
    edges: [
      { from: "staff", to: "api", label: "poll 9s", dashed: true },
      { from: "board", to: "api", label: "poll 10s", dashed: true },
      { from: "patient", to: "api", label: "poll 10–120s", dashed: true },
      { from: "api", to: "cache" },
      { from: "cache", to: "db" },
      { from: "api", to: "db", label: "writes" },
      { from: "cron", to: "api", label: "wake", dashed: true },
    ],
  },

  savoney: {
    caption:
      "One package of schemas that both sides import, so client and server cannot disagree about shape.",
    width: 720,
    height: 360,
    nodes: [
      { id: "client", label: "React client", sub: "Recharts", x: 90, y: 110, kind: "client" },
      { id: "shared", label: "shared/", sub: "Zod · z.infer", x: 330, y: 40, kind: "gate" },
      { id: "api", label: "Express API", sub: "6 resource groups", x: 380, y: 200, kind: "service" },
      { id: "refresh", label: "/auth/refresh", sub: "cookie scoped here", x: 120, y: 290, kind: "service" },
      { id: "mongo", label: "MongoDB", sub: "user + date indexes", x: 620, y: 290, kind: "data" },
    ],
    edges: [
      { from: "client", to: "api", label: "REST" },
      { from: "shared", to: "client", label: "types", dashed: true },
      { from: "shared", to: "api", label: "validates", dashed: true },
      { from: "api", to: "mongo", label: "aggregation" },
      { from: "client", to: "refresh", label: "rotate" },
      { from: "refresh", to: "mongo", label: "token family" },
    ],
  },

  "lexora-ai": {
    caption:
      "Two isolated model stages, a validation gate after each, and no route from a failed stage to the database.",
    width: 720,
    height: 360,
    nodes: [
      { id: "app", label: "Next.js", sub: "App Router", x: 60, y: 175, kind: "client" },
      { id: "grade", label: "Stage 1 · Groq", sub: "grade + extract", x: 250, y: 90, kind: "external" },
      { id: "gate1", label: "Zod gate", sub: "quotes checked verbatim", x: 430, y: 90, kind: "gate" },
      {
        id: "practice",
        label: "Stage 2 · Groq",
        sub: "practice questions",
        x: 250,
        y: 260,
        kind: "external",
      },
      { id: "gate2", label: "Zod gate", sub: "8-category union", x: 430, y: 260, kind: "gate" },
      { id: "db", label: "PostgreSQL", sub: "CHECK constraint", x: 630, y: 175, kind: "data" },
      { id: "failed", label: "failed", sub: "no partial results", x: 430, y: 175, kind: "gate" },
    ],
    edges: [
      { from: "app", to: "grade" },
      { from: "grade", to: "gate1" },
      { from: "gate1", to: "practice", label: "mistakes", curve: 40 },
      { from: "practice", to: "gate2" },
      { from: "gate2", to: "db" },
      { from: "gate1", to: "failed", label: "reject", dashed: true },
      { from: "gate2", to: "failed", label: "reject", dashed: true },
    ],
  },
};

export const diagramLegend = [
  { kind: "client" as const, label: "Browser" },
  { kind: "service" as const, label: "Service" },
  { kind: "gate" as const, label: "Gate / cache" },
  { kind: "data" as const, label: "Data" },
  { kind: "external" as const, label: "External" },
];
