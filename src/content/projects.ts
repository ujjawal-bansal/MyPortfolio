import { PENDING, type Link } from "./types";

/**
 * Case studies, not cards — and short. A reviewer should get the whole of a project in
 * a minute and never be asked to wade.
 *
 * Every line traces to docs/facts.md, which was re-verified against the repositories.
 * Nothing is rounded up; where there is no number, none is claimed.
 */

/** The copy for one case study. Every field is deliberately short — see the limits. */
export interface CaseStudyStory {
  /** One or two sentences: what was wrong. */
  problem: string;
  /** The problem at its sharpest. One line. */
  question: string;
  /** One or two sentences: what was built. */
  solution: string;
  /** One line: what is true now. */
  result: string;
  /** One or two sentences: how it fits together. The diagram does the rest. */
  architecture: string;
  /** Three or four one-liners. The engineering that matters, and nothing else. */
  depth: readonly string[];
  /** One line: the lesson the page closes on. */
  takeaway: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  /** Five words, shown under the name. */
  tagline: string;
  /** One sentence, for the home page listing. */
  summary: string;
  status: "live" | "built";
  stack: readonly { group: string; items: readonly string[] }[];
  story: CaseStudyStory;
  links: readonly Link[];
  /** Things Ujjawal still needs to supply for this project. Not rendered. */
  pending: readonly string[];
}

export const projects: readonly CaseStudy[] = [
  {
    slug: "queuelite",
    name: "QueueLite",
    tagline: "Queue management for small clinics",
    summary:
      "An OPD queue system running in a working eye clinic, where the hard part turned out to be a date boundary rather than the queue.",
    status: "live",
    stack: [
      { group: "Frontend", items: ["React 19", "Vite"] },
      { group: "Backend", items: ["Express 5", "Node 20"] },
      { group: "Data", items: ["PostgreSQL", "Supabase"] },
      { group: "Hosting", items: ["Vercel", "Render"] },
    ],
    story: {
      problem:
        "Small clinics run their queue on a paper register and a raised voice. Nobody knows how long they'll wait, so nobody leaves the room.",
      question: "What's actually scarce — the doctor's time, or knowing where you stand?",
      solution:
        "Show everyone where they stand: a desk for staff to issue tokens, a board for the waiting room, and a tracker on each patient's phone.",
      result: "Live at Dev Eye Care, Moradabad, handling 30–40 patients a day.",
      architecture:
        "React on Vercel, an Express API on Render, Postgres on Supabase. Vercel proxies /api to Render, so it runs as one origin — no CORS, first-party cookies.",
      depth: [
        "A unique index on (clinic_id, token_day, token_number) makes duplicate tokens impossible; a clash just retries.",
        "The bug that actually bit was IST midnight, not a race — fixed by storing the day instead of deriving it.",
        "Polling, not WebSockets: every 10s near the front of the queue, stretching to 2m40 at the back.",
        "A 2.5s snapshot means a whole waiting room refreshing at once costs one database read.",
      ],
      takeaway:
        "A rule in application code is one you have to remember. A rule in the database remembers itself.",
    },
    links: [
      { label: "Repository", href: "https://github.com/ujjawal-bansal/QueueLite", external: true },
      { label: "Live site", href: "https://queuelite.vercel.app/", external: true },
    ],
    pending: ["Dates: started, went live", "Screenshots of the desk, board and tracker"],
  },

  {
    slug: "savoney",
    name: "Savoney",
    tagline: "Personal finance, typed end to end",
    summary:
      "An expense tracker whose real subject is session security — what happens after a refresh token is stolen.",
    status: "built",
    stack: [
      { group: "Language", items: ["TypeScript"] },
      { group: "Frontend", items: ["React 19", "TanStack Query", "Recharts"] },
      { group: "Backend", items: ["Express 5", "Mongoose 9"] },
      { group: "Data", items: ["MongoDB 8"] },
      { group: "Shared", items: ["Zod"] },
    ],
    story: {
      problem:
        "Expense trackers either demand a discipline nobody keeps, or collect everything and tell you nothing.",
      question: "If an app asks for my attention every day, what does it owe me back?",
      solution:
        "A TypeScript monorepo where one set of Zod schemas drives the client, the server and the API docs — so none of them can drift.",
      result: "Built end to end: auth, transactions, budgets, goals and analytics.",
      architecture:
        "A React 19 client and an Express 5 API over MongoDB 8, sharing a single package of Zod schemas and types.",
      depth: [
        "Refresh tokens are single-use; presenting one twice revokes the entire session family.",
        "Access tokens live 15 minutes, in memory — never localStorage.",
        "The refresh cookie is SameSite=Strict and scoped to /api/auth, which makes the API CSRF-safe by design.",
        "Passwords use Argon2id; money is stored as integer minor units, never floats.",
      ],
      takeaway: "I can't stop a token being stolen — but I can make using it announce itself.",
    },
    links: [
      { label: "Repository", href: "https://github.com/ujjawal-bansal/Savoney", external: true },
      { label: "Live site", href: PENDING, external: true },
    ],
    pending: ["Live URL, or confirmation that it is not deployed", "Dates", "Screenshots of the dashboard"],
  },

  {
    slug: "lexora-ai",
    name: "Lexora AI",
    tagline: "Essay feedback that refuses to guess",
    summary: "An AI feedback pipeline built around a rule: the model judges, the application decides.",
    status: "built",
    stack: [
      { group: "Framework", items: ["Next.js 15", "React 19", "TypeScript"] },
      { group: "Data", items: ["PostgreSQL", "Supabase"] },
      { group: "Model", items: ["Groq", "llama-3.3-70b-versatile"] },
      { group: "Validation", items: ["Zod"] },
    ],
    story: {
      problem:
        "Useful essay feedback is specific — this sentence, this claim — and that takes a teacher hours, so most students rarely get it.",
      question: "How much of grading can you take away from the model without making it useless?",
      solution:
        "Let the model do the judging. Everything after the judgement is plain code that can be tested.",
      result: "Live on Vercel — the model only judges; routing, taxonomy and storage are all deterministic.",
      architecture:
        "Next.js 15 on Vercel, Postgres on Supabase, and Groq's llama-3.3-70b — four stages, each with a countable number of model calls.",
      depth: [
        "Zod checks every model response — Groq's JSON mode isn't schema-validated, so this is the real gate.",
        "The first two stages commit in one transaction: a student sees the whole analysis or none of it.",
        "Eight mistake categories, enforced by a Postgres constraint, a TypeScript union and the prompt.",
        "Routing is plain code: grammar mistakes get multiple choice, structural ones get a short answer.",
      ],
      takeaway:
        "The real question isn't how good the model is — it's what the system believes without checking.",
    },
    links: [
      { label: "Repository", href: "https://github.com/ujjawal-bansal/Lexora-AI", external: true },
      { label: "Live site", href: "https://lexora--ai.vercel.app/", external: true },
    ],
    pending: ["Dates", "Screenshots of the feedback view"],
  },
];

export function projectBySlug(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}
