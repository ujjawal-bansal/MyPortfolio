import { PENDING, type Link, type Maybe } from "./types";

/**
 * Case studies, not cards. Each follows the same arc:
 * problem → question → idea → system → engineering problem → solution → result → learned.
 *
 * Every technical claim here comes from docs/facts.md. Nothing is rounded up, and
 * anything without a verified number says so rather than guessing.
 */

export interface CaseStudyArc {
  /** The situation before the software existed. */
  problem: string;
  /** The one sentence the project is an answer to. */
  question: string;
  /** The reframing that made it tractable. */
  idea: string;
  /** What actually got built. */
  system: string;
  /** The specific thing that was hard — not "scaling", an actual failure mode. */
  engineeringProblem: string;
  /** How it was solved, concretely enough to be checked. */
  solution: string;
  /** What is true now. */
  result: string;
  /** The part that transfers to the next project. */
  learned: string;
}

export interface TechNote {
  label: string;
  body: string;
}

export interface CaseStudy {
  slug: string;
  name: string;
  /** Five words, shown under the name. */
  tagline: string;
  /** One sentence for listings. */
  summary: string;
  status: "live" | "built";
  /** Only set when `status` is "live" and the deployment is verified. */
  deployment: Maybe<string>;
  stack: readonly { group: string; items: readonly string[] }[];
  arc: CaseStudyArc;
  /** The details an engineer would actually want. Rendered as a disclosure list. */
  notes: readonly TechNote[];
  links: readonly Link[];
  /** Things Ujjawal still needs to supply for this project. */
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
    deployment: "Dev Eye Care, Moradabad — roughly 30–40 patients a day",
    stack: [
      { group: "Frontend", items: ["React", "Vite"] },
      { group: "Backend", items: ["Node.js", "Express"] },
      { group: "Data", items: ["PostgreSQL", "Supabase"] },
      { group: "Hosting", items: ["Vercel", "Render"] },
    ],
    arc: {
      problem:
        "A small clinic's OPD queue runs on a paper register and a raised voice. Nobody in the room knows whether they are ten minutes away or ninety, so nobody leaves — which is how a waiting room ends up full of people who did not need to be in it yet.",
      question: "What is actually scarce here — the doctor's time, or knowing where you stand?",
      idea: 'A token number is trivial to issue. The valuable thing is the answer to "how far away am I", delivered to three different audiences at once: the staff member issuing tokens, the room watching the board, and the patient who would like to go get chai.',
      system:
        "Three surfaces over one Postgres database. A staff desk for issuing and calling tokens, a waiting-room display, and a patient tracker on a phone. React and Vite on Vercel, an Express API on Render, Postgres on Supabase.",
      engineeringProblem:
        "Two people issue a token at the same instant and both get number 34. This is the obvious risk. The one that actually bit was subtler: a stored function computed the day's token number from the current date, and at IST midnight the boundary moved under it — so the register started issuing duplicate numbers on its own, without any concurrency at all.",
      solution:
        "Make the database refuse the bad state rather than asking the application to avoid it. A unique index on (clinic_id, token_day, token_number) makes a duplicate physically impossible; the API catches Postgres error 23505 and optimistically retries with the next number. The midnight bug was fixed by storing token_day as a real column instead of deriving it, renumbering the affected rows with ROW_NUMBER, and letting that same unique index stand guard afterwards.",
      result:
        "In production at Dev Eye Care in Moradabad, handling roughly 30–40 patients a day. Live updates run on HTTP polling rather than WebSockets, which for this shape of problem is less machinery for the same outcome.",
      learned:
        "A uniqueness rule enforced in application code is a rule you have to remember; the same rule as an index is one the database remembers for you. And the race condition I designed for was not the one that broke — the bug came from a derived value I had assumed was stable.",
    },
    notes: [
      {
        label: "Why polling, not WebSockets",
        body: "Three consumers with different urgencies: the staff desk refreshes about every 9 seconds, the waiting-room board about every 10, and the patient tracker adapts between 10 and 120 seconds depending on how far back in the queue you are. All of it sits behind a 2.5-second request-coalescing snapshot cache, so a burst of clients produces one database read. A persistent socket per phone in a waiting room would have bought responsiveness nobody asked for, at the cost of reconnection logic on flaky mobile data.",
      },
      {
        label: "Auth without accounts",
        body: "Clinic staff share one desk and will not maintain individual logins. A shared staff passcode is hashed with scrypt and compared with timingSafeEqual, which then issues a JWT in an httpOnly cookie. A break-glass recovery code exists for the morning the passcode is forgotten, because that morning happens.",
      },
      {
        label: "Row-level security",
        body: "The tokens table is deny-all to the anon role; the API reaches it with the service role. The public surface cannot read the queue directly even if someone finds the project URL.",
      },
      {
        label: "Reminders, and what shipped instead",
        body: "WhatsApp Cloud API integration exists in the codebase. In daily use, staff send a pre-filled wa.me deep link instead — fewer moving parts, no template approval, and it works on the phone already in their hand. Worth recording as the honest version rather than the impressive one.",
      },
      {
        label: "Cold starts",
        body: "Render spins the backend down when idle, which for a clinic opening at 9am means the first patient of the day waits for a boot. A GitHub Actions cron keeps it warm.",
      },
    ],
    links: [
      { label: "Repository", href: PENDING, external: true },
      { label: "Live site", href: PENDING, external: true },
    ],
    pending: [
      "Repository URL",
      "Live URL (or a note that it is private to the clinic)",
      "Dates: when it was started, when it went live",
      "Screenshots of the staff desk, waiting-room board and patient tracker",
    ],
  },

  {
    slug: "savoney",
    name: "Savoney",
    tagline: "Personal finance, typed end to end",
    summary:
      "An expense tracker whose real subject is session security — what happens after a refresh token is stolen.",
    status: "built",
    deployment: PENDING,
    stack: [
      { group: "Language", items: ["TypeScript"] },
      { group: "Frontend", items: ["React", "Recharts"] },
      { group: "Backend", items: ["Node.js", "Express"] },
      { group: "Data", items: ["MongoDB"] },
      { group: "Shared", items: ["Zod"] },
    ],
    arc: {
      problem:
        "Expense trackers tend to fail in one of two directions. Either they demand a level of daily discipline nobody sustains, or they collect everything faithfully and then tell you nothing you did not already know.",
      question: "If the app is going to ask for my attention every day, what does it owe me back?",
      idea: "Build it as a TypeScript monorepo — shared, server, client — with Zod schemas in the shared package. Client and server then cannot quietly disagree about the shape of a transaction, because there is only one definition and both import it.",
      system:
        "Six REST resource groups: auth, transactions, categories, budgets, goals, analytics. The dashboards are Recharts over MongoDB aggregation pipelines, with compound user+date indexes so a year of one person's history is an index scan rather than a collection scan.",
      engineeringProblem:
        "A stolen refresh token is, to the server, indistinguishable from a legitimate one. It is the right length, it is signed correctly, it is not expired. Rotation alone does not fix this — it just means the thief and the real user are now racing for the next token.",
      solution:
        "Rotation plus reuse detection. Each refresh issues a new token and invalidates the old one, so a token presented twice is proof that something has gone wrong — and the response is to revoke the entire token family, logging out the thief and the victim together. A session epoch gives a blunt global invalidation lever for when that is the right call. The refresh cookie is scoped to the single route that consumes it, so it is not sent along with every ordinary API request.",
      result:
        "A finance app where the interesting engineering is not in the charts. Auth flows, schema validation and aggregation pipelines all work; adoption numbers are not claimed because there are none to claim.",
      learned:
        "Detection can be worth more than prevention. I could not stop a token from being stolen, but I could make using it a self-announcing act. Also: sharing types across a boundary removes a category of bug rather than reducing its frequency, and those are very different wins.",
    },
    notes: [
      {
        label: "One schema, three packages",
        body: "Zod schemas live in the shared package and both sides derive their types with z.infer. The server validates at the edge, the client validates before submitting, and neither can drift from the other without the build failing.",
      },
      {
        label: "Aggregation, not iteration",
        body: "Category breakdowns and month-over-month comparisons are MongoDB aggregation pipelines rather than documents fetched and reduced in Node. Compound user+date indexes keep the common query — one user, one date range — off a full scan.",
      },
      {
        label: "Not real-time",
        body: "Worth stating plainly, because finance dashboards invite the assumption: this is request/response. Numbers update when you ask for them.",
      },
    ],
    links: [
      { label: "Repository", href: PENDING, external: true },
      { label: "Live site", href: PENDING, external: true },
    ],
    pending: [
      "Repository URL",
      "Live URL, or confirmation that it is not deployed",
      "Dates: when it was built",
      "Screenshots of the dashboard",
    ],
  },

  {
    slug: "lexora-ai",
    name: "Lexora AI",
    tagline: "Essay feedback that refuses to guess",
    summary: "An AI feedback pipeline built around a rule: the model judges, the application decides.",
    status: "built",
    deployment: PENDING,
    stack: [
      { group: "Framework", items: ["Next.js (App Router)", "TypeScript"] },
      { group: "Data", items: ["PostgreSQL", "Supabase"] },
      { group: "Model", items: ["Groq"] },
      { group: "Validation", items: ["Zod"] },
    ],
    arc: {
      problem:
        "Useful essay feedback is specific — this sentence, this claim, this transition. Feedback at that resolution takes a teacher a long time, so most students get it rarely, late, or not at all.",
      question: "How much of grading can be taken away from the model without making it useless?",
      idea: "Split the work by kind. Judgement — is this argument supported, is this sentence ungrammatical — is what a language model is for. Everything downstream of that judgement is ordinary logic and belongs in code, where it can be tested.",
      system:
        "Two isolated Groq stages. The first grades the essay and extracts mistakes; the second generates practice questions from them. Four Groq call sites in the whole application, deliberately countable. Next.js App Router over Postgres on Supabase.",
      engineeringProblem:
        "A model that half-succeeds is worse than one that fails outright. A partial result looks exactly like a complete one — same formatting, same confidence — so a student reads a grade computed from an extraction that silently dropped half the essay, and has no way to tell.",
      solution:
        "All or nothing. If a stage fails, the submission is marked 'failed' and no partial results are written; there is no state where a student sees half an analysis. Zod validates at every boundary where model output enters the system, with z.infer types so the parsed shape and the TypeScript type cannot diverge. Any quote the model flags is checked verbatim against the source essay before it is shown, which makes a fabricated quotation a caught error rather than a convincing one.",
      result:
        "A pipeline where the failure modes are enumerable. The model is confined to judgement; routing, taxonomy and persistence are deterministic and inspectable.",
      learned:
        'The useful question about an LLM feature is not "how good is the model" but "what is this system allowed to believe without checking". Every answer I moved out of the model made the thing easier to trust — and much easier to debug at 1am.',
    },
    notes: [
      {
        label: "A taxonomy the database enforces",
        body: "Eight mistake categories, fixed. The constraint lives in Postgres and the union type lives in TypeScript, so a ninth category invented mid-generation fails on insert rather than quietly becoming a new kind of feedback nobody designed for.",
      },
      {
        label: "Deterministic routing",
        body: "Which practice a mistake earns is decided in application logic, not by the model: grammar mistakes route to multiple choice, structural ones to short response. Same input, same route, every time — which also means the routing can be unit tested.",
      },
      {
        label: "Verbatim quote checking",
        body: "Hallucinated quotations are the most persuasive failure an essay grader can produce. Every flagged quote is matched against the source text before it reaches the student.",
      },
    ],
    links: [
      { label: "Repository", href: PENDING, external: true },
      { label: "Live site", href: PENDING, external: true },
    ],
    pending: [
      "Repository URL",
      "Live URL, or confirmation that it is not deployed",
      "Dates: when it was built",
      "Screenshots of the feedback view",
    ],
  },
];

export function projectBySlug(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}
