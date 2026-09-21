/**
 * All-time unique visitors, counted in a Redis HyperLogLog.
 *
 * **Server only.** Nothing here may be imported from a client component: it reads the
 * Upstash credentials, and it sees raw IP addresses.
 *
 * ## Why a HyperLogLog and not a SET of hashed visitors
 *
 * The obvious design is `SADD visitors <sha256(ip)>` and `SCARD` to read it. It is exact,
 * and it is a worse idea, because **a hashed IP address is not anonymous**. IPv4 has only
 * ~4.3 billion possible values; anyone who obtains the set and the salt can hash the
 * entire address space in minutes and recover every visitor's IP. Storing that set is
 * storing personal data with an extra step.
 *
 * A HyperLogLog folds each value into 16384 six-bit registers and discards it. There is
 * nothing to reverse, nothing to enumerate, and nothing to leak: the structure cannot
 * answer "was this person here", only "roughly how many distinct people were". It is also
 * ~12kB forever, whether the site has had 300 visitors or 30 million.
 *
 * The cost is accuracy: PFCOUNT carries a standard error of 0.81%. At 12,000 visitors
 * that is about ±100. For a number on a portfolio that is the right trade; for billing it
 * would not be.
 *
 * ## Identifying a visitor
 *
 * HMAC-SHA256 over the IP and the user agent, keyed with a server-side secret. The user
 * agent is in there so that two people behind one NAT are not collapsed into one.
 *
 * The salt is deliberately **not** rotated. Plausible and similar tools rotate daily so a
 * hash cannot be linked across days, but daily rotation means everybody is recounted every
 * day, which is the opposite of an all-time figure. Since the hash is never written
 * anywhere — it exists for the duration of one PFADD and then the register is all that
 * remains — a stable salt costs nothing at rest.
 */

const KEY = "portfolio:visitors:all";

/** Crawlers, previewers, uptime pokers. Cheap, imperfect, and worth doing. */
const BOTS =
  /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|embedly|quora link preview|pinterest|vkshare|whatsapp|telegram|discord|slack|curl|wget|python-requests|axios|node-fetch|go-http|headless|phantom|puppeteer|playwright|lighthouse|pagespeed|gtmetrix|ahrefs|semrush|mj12|dotbot|petal|bytespider|monitor|uptime|pingdom/i;

export interface VisitorResult {
  /** Null when Redis is unreachable or unconfigured. The UI renders nothing. */
  count: number | null;
  /** True when this request was not counted (a bot, or a request without a user agent). */
  skipped: boolean;
}

/**
 * Server-side only. Vercel collects a function's `console.error` into the runtime log for
 * that deployment; none of this reaches the browser, the response body or the bundle.
 *
 * Every failure below returns the same `count: null`, which is right for the UI — an empty
 * corner beats a wrong number — and useless for working out why. These lines cost nothing
 * on the happy path and name the cause on the unhappy one.
 */
function note(stage: string, detail: string): void {
  console.error(`[visitors] ${stage}: ${detail}`);
}

/**
 * Describes a configured value without printing it.
 *
 * The token is a credential and never goes to a log, but its *shape* is exactly what tends
 * to be wrong. A value pasted out of a `.env` file carries its quotes, a copy that clipped
 * short is the wrong length, and a paste that caught a newline is padded. Length and
 * quoting give all of that away while revealing nothing usable.
 */
function shapeOf(raw: string | undefined): string {
  if (raw === undefined) return "unset";
  if (raw === "") return "empty";
  const parts = [`${raw.length} chars`];
  if (/^["']|["']$/.test(raw.trim())) parts.push("WRAPPED IN QUOTES");
  if (raw !== raw.trim()) parts.push("padded with whitespace");
  return parts.join(", ");
}

function credentials(): { url: string; token: string } | null {
  const rawUrl = process.env.UPSTASH_REDIS_REST_URL;
  const rawToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  const url = rawUrl?.trim();
  const token = rawToken?.trim();

  if (!url || !token) {
    note("config", `url is ${shapeOf(rawUrl)}, token is ${shapeOf(rawToken)}`);
    return null;
  }

  // A malformed URL surfaces inside `fetch` as a bare TypeError several frames from
  // anything that names the cause. Parsing it here says which variable is at fault.
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    note("config", `UPSTASH_REDIS_REST_URL does not parse — ${shapeOf(rawUrl)}`);
    return null;
  }
  if (parsed.protocol !== "https:") {
    note("config", `UPSTASH_REDIS_REST_URL has protocol ${parsed.protocol}, expected https:`);
    return null;
  }
  note("config", `ok — host ${parsed.hostname}, token ${token.length} chars`);

  return { url: url.replace(/\/$/, ""), token };
}

/**
 * Web Crypto rather than `node:crypto`, so this keeps working if the route is ever moved
 * to the edge runtime.
 */
async function fingerprint(ip: string, userAgent: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${ip}\n${userAgent}`));
  // 16 bytes is far more than a HyperLogLog needs to distribute a value evenly.
  return Array.from(new Uint8Array(mac).slice(0, 16))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** The first entry in `x-forwarded-for` is the client; the rest are proxies. */
export function clientIp(headers: Headers): string | null {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() || null;
}

export function looksAutomated(headers: Headers): boolean {
  const ua = headers.get("user-agent");
  // A browser always sends one. Something that does not is not a curious mind.
  if (!ua || ua.length < 12) return true;
  if (BOTS.test(ua)) return true;
  // Link previews and speculative prefetches, which the visitor never actually saw.
  const purpose = headers.get("purpose") ?? headers.get("x-purpose") ?? "";
  if (/prefetch|preview/i.test(purpose)) return true;
  if (headers.get("sec-purpose")?.includes("prefetch")) return true;
  return false;
}

/**
 * Records the visitor and returns the total, in a single round trip.
 *
 * PFADD is atomic, so concurrent requests from the same person are a no-op rather than a
 * race: the second one finds the registers already set. That also makes the endpoint
 * safe to call twice, which React does in development.
 */
export async function recordVisit(headers: Headers): Promise<VisitorResult> {
  const creds = credentials();
  if (!creds) return { count: null, skipped: true };

  if (looksAutomated(headers)) {
    return { count: await readCount(creds), skipped: true };
  }

  const ip = clientIp(headers);
  const ua = headers.get("user-agent") ?? "";
  if (!ip) return { count: await readCount(creds), skipped: true };

  // A dedicated salt if one exists, otherwise the Redis token, which is already a
  // server-only secret. Either way it never reaches the client.
  const secret = process.env.VISITOR_SALT?.trim() || creds.token;
  const id = await fingerprint(ip, ua, secret);

  const body = JSON.stringify([
    ["PFADD", KEY, id],
    ["PFCOUNT", KEY],
  ]);

  try {
    const res = await fetch(`${creds.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${creds.token}`, "Content-Type": "application/json" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) {
      note("pipeline", `upstash answered ${res.status} ${res.statusText}`);
      return { count: null, skipped: false };
    }
    const json = (await res.json()) as Array<{ result?: unknown; error?: string }>;
    const rejected = Array.isArray(json) ? json.find((entry) => entry?.error) : undefined;
    if (rejected) note("pipeline", `upstash rejected a command: ${rejected.error}`);
    const count = Number(json?.[1]?.result);
    if (!Number.isFinite(count)) {
      note("pipeline", `no count in the reply: ${JSON.stringify(json).slice(0, 200)}`);
    }
    return { count: Number.isFinite(count) ? count : null, skipped: false };
  } catch (error) {
    // A counter is never worth failing a page over.
    note("pipeline", error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    return { count: null, skipped: false };
  }
}

async function readCount(creds: { url: string; token: string }): Promise<number | null> {
  try {
    const res = await fetch(`${creds.url}/pfcount/${encodeURIComponent(KEY)}`, {
      headers: { Authorization: `Bearer ${creds.token}` },
      cache: "no-store",
      signal: AbortSignal.timeout(2500),
    });
    if (!res.ok) {
      note("pfcount", `upstash answered ${res.status} ${res.statusText}`);
      return null;
    }
    const json = (await res.json()) as { result?: unknown };
    const count = Number(json?.result);
    if (!Number.isFinite(count))
      note("pfcount", `no count in the reply: ${JSON.stringify(json).slice(0, 200)}`);
    return Number.isFinite(count) ? count : null;
  } catch (error) {
    note("pfcount", error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    return null;
  }
}
