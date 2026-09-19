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
      { group: "Frontend", items: ["React 19", "Vite"] },
      { group: "Backend", items: ["Express 5", "Node 20"] },
      { group: "Data", items: ["PostgreSQL", "Supabase"] },
      { group: "Hosting", items: ["Vercel", "Render"] },
    ],
    arc: {
      problem:
        "A small clinic's OPD queue runs on a paper register and a raised voice. Nobody in the room knows whether they are ten minutes away or ninety, so nobody leaves — which is how a waiting room ends up full of people who did not need to be in it yet.",
      question: "What is actually scarce here — the doctor's time, or knowing where you stand?",
      idea: 'A token number is trivial to issue. The valuable thing is the answer to "how far away am I", delivered to three different audiences at once: the staff member issuing tokens, the room watching the board, and the patient who would like to go get chai.',
      system:
        "Three surfaces over one Postgres database: a staff desk for issuing and calling tokens, a waiting-room display, and a patient tracker on a phone. Vercel rewrites /api/* through to the Express API on Render, so the whole thing is one origin — no CORS, and staff session cookies are first-party. The browser never holds a database key; the API reaches Supabase with the service role.",
      engineeringProblem:
        "Two people issue a token at the same instant and both get number 34. This is the obvious risk. The one that actually bit was subtler: a stored function computed the day's token number from the current date, and at IST midnight the boundary moved under it — so the register started issuing duplicate numbers on its own, without any concurrency at all.",
      solution:
        "Make the database refuse the bad state rather than asking the application to avoid it. A unique index on (clinic_id, token_day, token_number) makes a duplicate physically impossible; the API catches Postgres error 23505 and optimistically retries with the next number. The midnight bug was fixed by storing token_day as a real column instead of deriving it, renumbering the affected rows with ROW_NUMBER, and letting that same unique index stand guard afterwards.",
      result:
        "In production at Dev Eye Care in Moradabad, handling roughly 30–40 patients a day and built with headroom for about 100. Live updates run on HTTP polling rather than WebSockets, which for this shape of problem is less machinery for the same outcome.",
      learned:
        "A uniqueness rule enforced in application code is a rule you have to remember; the same rule as an index is one the database remembers for you. And the race condition I designed for was not the one that broke — the bug came from a derived value I had assumed was stable.",
    },
    notes: [
      {
        label: "Why polling, not WebSockets",
        body: "Urgency scales with position: about ten seconds at the front of the queue, stretching to two minutes forty for someone far enough back that they have time to go and get chai. Behind all of it is a snapshot held in process for 2.5 seconds and discarded the moment staff change anything — so a whole waiting room refreshing at once costs a single database read. A persistent socket per phone would have bought responsiveness nobody asked for, at the cost of reconnection logic on flaky mobile data.",
      },
      {
        label: "Auth without accounts",
        body: "Clinic staff share one desk and will not maintain individual logins. A shared passcode is hashed with scrypt and compared with timingSafeEqual, which issues a twelve-hour JWT in an httpOnly cookie. A break-glass recovery code exists for the morning the passcode is forgotten, because that morning happens — rate limited to ten attempts an hour, with a warning banner while it is in use. Sign-ins cap at 30 per fifteen minutes, writes at 240 a minute.",
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
      { label: "Repository", href: "https://github.com/ujjawal-bansal/QueueLite", external: true },
      { label: "Live site", href: "https://queuelite.vercel.app/", external: true },
    ],
    pending: [
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
      { group: "Frontend", items: ["React 19", "TanStack Query", "Recharts"] },
      { group: "Backend", items: ["Express 5", "Mongoose 9"] },
      { group: "Data", items: ["MongoDB 8"] },
      { group: "Shared", items: ["Zod"] },
    ],
    arc: {
      problem:
        "Expense trackers tend to fail in one of two directions. Either they demand a level of daily discipline nobody sustains, or they collect everything faithfully and then tell you nothing you did not already know.",
      question: "If the app is going to ask for my attention every day, what does it owe me back?",
      idea: "Build it as a TypeScript monorepo — shared, server, client — with the Zod schemas in the shared package. Client forms, server validation and the OpenAPI document at /api/docs all derive from that one definition, so the published contract cannot drift from the behaviour. Money is stored as integer minor units throughout, because floating-point currency is a rounding error waiting to happen.",
      system:
        "Six REST resource groups: sessions and auth, transactions with import and export, categories, budgets, goals, and analytics. Routes stay thin — parse, validate, delegate to a service, shape a response — with error middleware turning thrown ApiErrors into responses. Dashboards are Recharts over MongoDB aggregation pipelines, with compound user+date indexes so a year of one person's history is an index scan rather than a collection scan.",
      engineeringProblem:
        "A stolen refresh token is, to the server, indistinguishable from a legitimate one. It is the right length, it is signed correctly, it is not expired. Rotation alone does not fix this — it just means the thief and the real user are now racing for the next token.",
      solution:
        "Rotation plus reuse detection. Refresh tokens are single use: each refresh issues a new one and burns the old, so a token presented twice is proof something has gone wrong — and the response is to revoke the whole session family, logging out the thief and the victim together. Access tokens live fifteen minutes and are held in memory, never in localStorage. The thirty-day refresh cookie is httpOnly, SameSite=Strict and scoped to /api/auth, so it never rides along with ordinary requests — which also makes the API CSRF-safe by construction, since browsers attach cookies automatically but never Authorization headers.",
      result:
        "A finance app where the interesting engineering is not in the charts. Auth flows, schema validation and aggregation pipelines all work; adoption numbers are not claimed because there are none to claim.",
      learned:
        "Detection can be worth more than prevention. I could not stop a token from being stolen, but I could make using it a self-announcing act. Also: sharing types across a boundary removes a category of bug rather than reducing its frequency, and those are very different wins.",
    },
    notes: [
      {
        label: "One schema, three packages",
        body: "Zod schemas live in the shared package and every consumer derives from them with z.infer — server validation, client forms through @hookform/resolvers, and the generated OpenAPI document. None of the three can drift without the build failing.",
      },
      {
        label: "Aggregation, not iteration",
        body: "Category breakdowns and month-over-month comparisons are MongoDB aggregation pipelines rather than documents fetched and reduced in Node. Compound user+date indexes keep the common query — one user, one date range — off a full scan.",
      },
      {
        label: "Passwords",
        body: "Argon2id at 19 MiB, t=2, p=1. Memory-hard, and without bcrypt's 72-byte truncation quietly discarding the end of a long passphrase.",
      },
      {
        label: "Not real-time",
        body: "Worth stating plainly, because finance dashboards invite the assumption: this is request/response. Numbers update when you ask for them.",
      },
    ],
    links: [
      { label: "Repository", href: "https://github.com/ujjawal-bansal/Savoney", external: true },
      { label: "Live site", href: PENDING, external: true },
    ],
    pending: [
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
    deployment: "Deployed on Vercel",
    stack: [
      { group: "Framework", items: ["Next.js 15", "React 19", "TypeScript"] },
      { group: "Data", items: ["PostgreSQL", "Supabase"] },
      { group: "Model", items: ["Groq", "llama-3.3-70b-versatile"] },
      { group: "Validation", items: ["Zod"] },
    ],
    arc: {
      problem:
        "Useful essay feedback is specific — this sentence, this claim, this transition. Feedback at that resolution takes a teacher a long time, so most students get it rarely, late, or not at all.",
      question: "How much of grading can be taken away from the model without making it useless?",
      idea: "Split the work by kind. Judgement — is this argument supported, is this sentence ungrammatical — is what a language model is for. Everything downstream of that judgement is ordinary logic and belongs in code, where it can be tested.",
      system:
        "Four stages, each with a countable number of model calls. One call grades the essay and extracts mistakes. A second, batched, groups those mistakes by category and generates representative practice from them — three comma splices become one or two questions, not three identical ones, and that deduplication happens in application code before the model is asked anything. A third grades short answers on demand, one call each. A fourth lets a teacher ask questions in plain language across a whole class's aggregated mistakes.",
      engineeringProblem:
        "A model that half-succeeds is worse than one that fails outright. A partial result looks exactly like a complete one — same formatting, same confidence — so a student reads a grade computed from an extraction that silently dropped half the essay, and has no way to tell.",
      solution:
        "All or nothing, enforced where it cannot be forgotten: everything from the first two stages lands in a single database transaction, so a student either sees a complete analysis or none of it. Zod sits at every boundary where model output enters the system, because Groq's json_object mode is not schema-validated and llama-3.3-70b has no json_schema support — safeParse is the actual gate, not a formality. A category the model invents is dropped server-side rather than stored.",
      result:
        "A pipeline where the failure modes are enumerable. The model is confined to judgement; deduplication, routing, taxonomy and persistence are all deterministic and inspectable. Deliberately absent: file uploads, accounts, rate limiting and a numeric grade — each one left out because it would have added surface without adding feedback.",
      learned:
        'The useful question about an LLM feature is not "how good is the model" but "what is this system allowed to believe without checking". Every answer I moved out of the model made the thing easier to trust — and much easier to debug at 1am.',
    },
    notes: [
      {
        label: "A taxonomy the database enforces",
        body: "Eight mistake categories, fixed, and the same eight written down in three places at once: a CHECK constraint in Postgres, a literal union in TypeScript, and an explicit instruction in the prompt. A ninth invented mid-generation is dropped before it reaches the database. The cost of that rigidity is honest — a genuinely novel mistake has nowhere to go.",
      },
      {
        label: "Deterministic routing",
        body: "Which practice a mistake earns is decided in application logic, not by the model: grammar mistakes route to multiple choice, structural ones to short response. Same input, same route, every time — which also means the routing can be unit tested.",
      },
      {
        label: "Verbatim quote checking",
        body: "Hallucinated quotations are the most persuasive failure an essay grader can produce, so every flagged quote is matched against the source essay. A quote the model has paraphrased rather than copied is logged rather than thrown away — it is usually still pointing at the right sentence, and discarding real feedback over a wording difference helps nobody.",
      },
    ],
    links: [
      { label: "Repository", href: "https://github.com/ujjawal-bansal/Lexora-AI", external: true },
      { label: "Live site", href: "https://lexora--ai.vercel.app/", external: true },
    ],
    pending: ["Dates: when it was built", "Screenshots of the feedback view"],
  },
];

export function projectBySlug(slug: string): CaseStudy | undefined {
  return projects.find((p) => p.slug === slug);
}
