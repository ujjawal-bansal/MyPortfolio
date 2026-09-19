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
      "One origin, three surfaces on three different clocks, and a snapshot cache so a full waiting room costs one database read.",
    width: 760,
    height: 380,
    nodes: [
      { id: "staff", label: "Staff desk", sub: "React 19 · Vite", x: 78, y: 62, kind: "client" },
      { id: "board", label: "Waiting board", sub: "React 19 · Vite", x: 78, y: 185, kind: "client" },
      { id: "patient", label: "Patient tracker", sub: "React 19 · Vite", x: 78, y: 308, kind: "client" },
      { id: "edge", label: "Vercel", sub: "rewrites /api/*", x: 290, y: 185, kind: "gate" },
      { id: "api", label: "Express 5 API", sub: "Node 20 · Render", x: 500, y: 185, kind: "service" },
      { id: "cache", label: "Snapshot", sub: "2.5s, in process", x: 500, y: 62, kind: "gate" },
      { id: "db", label: "PostgreSQL", sub: "Supabase · service role", x: 680, y: 300, kind: "data" },
    ],
    edges: [
      { from: "staff", to: "edge", label: "10s", dashed: true },
      { from: "board", to: "edge", label: "10s", dashed: true },
      { from: "patient", to: "edge", label: "10s → 2m40", dashed: true },
      { from: "edge", to: "api", label: "same origin" },
      { from: "api", to: "cache", label: "serve" },
      { from: "cache", to: "db", label: "1 read" },
      { from: "api", to: "db", label: "writes · invalidate" },
    ],
  },

  savoney: {
    caption:
      "One package of Zod schemas that the client, the server and the OpenAPI document all derive from, so none of the three can drift.",
    width: 760,
    height: 380,
    nodes: [
      { id: "shared", label: "@savoney/shared", sub: "Zod · inferred types", x: 380, y: 52, kind: "gate" },
      {
        id: "client",
        label: "React 19 client",
        sub: "Vite · TanStack Query",
        x: 110,
        y: 190,
        kind: "client",
      },
      { id: "api", label: "Express 5 API", sub: "6 resource groups", x: 420, y: 205, kind: "service" },
      { id: "auth", label: "/api/auth", sub: "refresh cookie scoped here", x: 120, y: 330, kind: "service" },
      { id: "docs", label: "/api/docs", sub: "OpenAPI, generated", x: 680, y: 90, kind: "external" },
      { id: "mongo", label: "MongoDB 8", sub: "Mongoose 9 · minor units", x: 660, y: 310, kind: "data" },
    ],
    edges: [
      { from: "shared", to: "client", label: "forms" },
      { from: "shared", to: "api", label: "validates" },
      { from: "shared", to: "docs", label: "generates", dashed: true },
      { from: "client", to: "api", label: "REST" },
      { from: "client", to: "auth", label: "rotate" },
      { from: "auth", to: "mongo", label: "token family" },
      { from: "api", to: "mongo", label: "aggregation" },
    ],
  },

  "lexora-ai": {
    caption:
      "Four stages, a Zod gate after every model call, and one database transaction that either takes the whole result or none of it.",
    width: 780,
    height: 400,
    nodes: [
      { id: "app", label: "Next.js 15", sub: "App Router · Vercel", x: 86, y: 200, kind: "client" },
      { id: "s1", label: "Stage 1 · Groq", sub: "grade + extract · 1 call", x: 288, y: 74, kind: "external" },
      {
        id: "s2",
        label: "Stage 2 · Groq",
        sub: "group + generate · 1 batched",
        x: 288,
        y: 196,
        kind: "external",
      },
      {
        id: "s3",
        label: "Stage 3 · Groq",
        sub: "grade answers · on demand",
        x: 288,
        y: 318,
        kind: "external",
      },
      { id: "zod", label: "Zod gate", sub: "safeParse, every boundary", x: 508, y: 196, kind: "gate" },
      { id: "tx", label: "One transaction", sub: "all of it or none", x: 508, y: 318, kind: "gate" },
      { id: "db", label: "PostgreSQL", sub: "Supabase · CHECK on 8", x: 690, y: 258, kind: "data" },
      { id: "s4", label: "Stage 4", sub: "class-wide questions", x: 508, y: 74, kind: "external" },
    ],
    edges: [
      { from: "app", to: "s1" },
      { from: "app", to: "s3", label: "later" },
      { from: "s1", to: "zod" },
      { from: "s2", to: "zod" },
      { from: "s3", to: "zod" },
      { from: "zod", to: "s2", label: "dedup first", curve: -34 },
      { from: "zod", to: "tx" },
      { from: "tx", to: "db" },
      { from: "db", to: "s4", label: "aggregates", dashed: true },
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
