import { unstable_rethrow } from "next/navigation";
import { MAX_TRACKS } from "@/content/soundtrack";

/**
 * Recently played tracks, from Spotify.
 *
 * **Server only.** Nothing here may be imported from a client component: it reads the
 * client secret and the refresh token, and neither may ever reach a bundle.
 *
 * ## What this deliberately does not do
 *
 * It does not call `/me/player/currently-playing`, and the OAuth grant does not carry the
 * scope that would allow it. The only scope minted is `user-read-recently-played`, so the
 * site is *incapable* of revealing what is playing right now rather than merely declining
 * to. That is a stronger guarantee than a policy, and it survives someone editing this
 * file later without reading the comment.
 *
 * It also never carries a timestamp past this module. Spotify returns `played_at` on every
 * item and `Track` has no field to put it in, so "2 hours ago" cannot appear downstream by
 * accident. The section is a trace, not a log.
 *
 * ## Caching
 *
 * One call per revalidation window, shared by every visitor — not one call per visitor.
 * The page that renders this is ISR (see `app/page.tsx`), so the *rendered HTML* is the
 * cache: Spotify is touched when the window expires and the page regenerates, and every
 * visitor in between is served from the edge having cost nothing.
 *
 * **The fetches below deliberately carry no `cache` option**, so they inherit the page's
 * `revalidate`. That is not an omission. An explicit `cache: "no-store"` looks like the
 * careful choice and is the opposite: it tells Next the route cannot be prerendered, and
 * the whole home page silently becomes dynamic — rendered, and billed to Spotify, once per
 * visitor. It went unnoticed until real credentials existed, because without them this
 * module returns before reaching a fetch. The window lives in one place, `page.tsx`.
 *
 * The access token is therefore held in Next's server-side data cache for up to a window.
 * It lives an hour and a window is fifteen minutes, so a cached one is always still valid,
 * and it never leaves the server.
 *
 * Every `catch` here calls `unstable_rethrow` first. Next signals things like "this route
 * must be dynamic" by *throwing*, and a catch-all that logs and returns will swallow that
 * signal and misreport it as a Spotify failure — which is exactly how the above was found.
 *
 * `lastGood` is the third layer, and only for failures: if Spotify is down at the moment
 * the page happens to regenerate, the section shows the previous three rather than
 * emptying out over a blip.
 */

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const RECENT_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=50";

/** Spotify access tokens last an hour. Retire ours early so one is never used as it expires. */
const TOKEN_SAFETY_MS = 60_000;

/** Neither call is worth holding a page render open for. */
const TIMEOUT_MS = 6_000;

/** Album art comes in 640 / 300 / 64. The strip is never wider than a column; 300 is plenty. */
const PREFERRED_ART_WIDTH = 300;

/** A track, reduced to what the section can actually show. Note the absence of a date. */
export interface Track {
  /** Spotify id. Seeds the waveform shape, and addresses the embed. */
  id: string;
  title: string;
  /** Joined for display — the section has one line per track, not a credits list. */
  artists: string;
  /** Null for a local file, or anything Spotify has no image for. */
  art: string | null;
  /** `external_urls.spotify`. The official way off the site. */
  url: string;
}

interface SpotifyImage {
  url?: unknown;
  width?: unknown;
}

interface SpotifyTrack {
  id?: unknown;
  name?: unknown;
  artists?: unknown;
  album?: unknown;
  external_urls?: unknown;
  linked_from?: unknown;
}

/** Matches `lib/visitors.ts`: failures land in the Vercel runtime log, never in a response. */
function note(stage: string, detail: string): void {
  console.error(`[spotify] ${stage}: ${detail}`);
}

function shapeOf(raw: string | undefined): string {
  if (raw === undefined) return "unset";
  if (raw === "") return "empty";
  const parts = [`${raw.length} chars`];
  if (/^["']|["']$/.test(raw.trim())) parts.push("WRAPPED IN QUOTES");
  if (raw !== raw.trim()) parts.push("padded with whitespace");
  return parts.join(", ");
}

interface Credentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

function credentials(): Credentials | null {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim();
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim();

  if (!clientId || !clientSecret || !refreshToken) {
    // Not an error. The section is designed to be absent until this is configured, and
    // saying so once per render beats a silent empty space nobody can explain later.
    note(
      "config",
      `id is ${shapeOf(process.env.SPOTIFY_CLIENT_ID)}, secret is ${shapeOf(process.env.SPOTIFY_CLIENT_SECRET)}, refresh token is ${shapeOf(process.env.SPOTIFY_REFRESH_TOKEN)}`,
    );
    return null;
  }

  return { clientId, clientSecret, refreshToken };
}

let token: { value: string; expires: number } | null = null;
let lastGood: Track[] | null = null;

/**
 * Exchanges the long-lived refresh token for an access token.
 *
 * "Long-lived" is relative. The app dashboard states a refresh token lifetime — 180 days
 * for this one — after which the grant lapses and has to be minted again by hand with
 * `scripts/spotify-token.mjs`. Nothing here can renew it: that step needs a human at a
 * browser approving the app, which is the whole point of the flow.
 *
 * So this will fail one day, on a schedule, without anybody touching the code. That is
 * why the lapse is called out by name below rather than logged as a generic 400, and why
 * the section degrades to a drawing instead of an error: the failure mode is a certainty,
 * not an edge case.
 */
async function accessToken(creds: Credentials, force = false): Promise<string | null> {
  if (!force && token && token.expires > Date.now()) return token.value;

  const basic = Buffer.from(`${creds.clientId}:${creds.clientSecret}`).toString("base64");

  try {
    const res = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: creds.refreshToken,
      }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");

      // The one worth recognising on sight. It means the grant is gone: expired at the end
      // of its lifetime, revoked from the account's app list, or invalidated because the
      // client secret was rotated. All four are fixed the same way — re-run the script.
      if (body.includes("invalid_grant")) {
        note("token", "the refresh token is no longer valid — re-run scripts/spotify-token.mjs");
        return null;
      }

      note("token", `spotify answered ${res.status} ${res.statusText} ${body.slice(0, 160)}`);
      return null;
    }

    const json = (await res.json()) as { access_token?: unknown; expires_in?: unknown };
    if (typeof json.access_token !== "string") {
      note("token", "no access_token in the reply");
      return null;
    }

    const lifetime = typeof json.expires_in === "number" ? json.expires_in * 1000 : 3_600_000;
    token = { value: json.access_token, expires: Date.now() + lifetime - TOKEN_SAFETY_MS };
    return token.value;
  } catch (error) {
    unstable_rethrow(error);
    note("token", error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    return null;
  }
}

function pickArt(images: unknown): string | null {
  if (!Array.isArray(images)) return null;

  const usable = (images as SpotifyImage[])
    .filter((image): image is { url: string; width: number } => {
      return typeof image?.url === "string" && typeof image?.width === "number";
    })
    .sort((a, b) => {
      return Math.abs(a.width - PREFERRED_ART_WIDTH) - Math.abs(b.width - PREFERRED_ART_WIDTH);
    });

  return usable[0]?.url ?? null;
}

function toTrack(raw: SpotifyTrack): Track | null {
  // A local file has no id, which means no embed and no link. Nothing to show.
  if (typeof raw?.id !== "string" || typeof raw?.name !== "string") return null;

  const artists = Array.isArray(raw.artists)
    ? (raw.artists as Array<{ name?: unknown }>)
        .map((artist) => artist?.name)
        .filter((name): name is string => typeof name === "string")
    : [];

  const album = raw.album as { images?: unknown } | undefined;
  const urls = raw.external_urls as { spotify?: unknown } | undefined;

  return {
    id: raw.id,
    title: raw.name,
    artists: artists.join(", "),
    art: pickArt(album?.images),
    url: typeof urls?.spotify === "string" ? urls.spotify : `https://open.spotify.com/track/${raw.id}`,
  };
}

/**
 * The three most recent distinct tracks, most recent first.
 *
 * Spotify returns a play *log*, so a song on repeat occupies several entries. Fifty are
 * requested and collapsed down to three, which is enough history that an afternoon spent
 * with one album still yields three different songs rather than one song three times.
 *
 * Deduplication keys on `linked_from.id` where it exists. Spotify hands back a different
 * track id for the same recording depending on the market, and without this the same song
 * can occupy two of the three places.
 */
function threeUnique(items: unknown): Track[] {
  if (!Array.isArray(items)) return [];

  const seen = new Set<string>();
  const tracks: Track[] = [];

  for (const item of items as Array<{ track?: SpotifyTrack }>) {
    const raw = item?.track;
    if (!raw) continue;

    const linked = raw.linked_from as { id?: unknown } | undefined;
    const identity = typeof linked?.id === "string" ? linked.id : raw.id;
    if (typeof identity !== "string" || seen.has(identity)) continue;

    const track = toTrack(raw);
    if (!track) continue;

    seen.add(identity);
    tracks.push(track);
    if (tracks.length >= MAX_TRACKS) break;
  }

  return tracks;
}

/**
 * Null when there is nothing to show — unconfigured, unreachable, or genuinely empty.
 * The section renders its drawn waveform in that case rather than a broken player.
 */
export async function recentTracks(): Promise<Track[] | null> {
  const creds = credentials();
  if (!creds) return null;

  const fetchWith = async (bearer: string) => {
    return fetch(RECENT_ENDPOINT, {
      headers: { Authorization: `Bearer ${bearer}` },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  };

  try {
    let bearer = await accessToken(creds);
    if (!bearer) return lastGood;

    let res = await fetchWith(bearer);

    // A cached token can expire between the check and the call, and Spotify invalidates
    // tokens early on its own account. One forced refresh is worth it; a loop is not.
    if (res.status === 401) {
      note("recent", "401 on a cached token — refreshing once");
      bearer = await accessToken(creds, true);
      if (!bearer) return lastGood;
      res = await fetchWith(bearer);
    }

    if (res.status === 429) {
      note("recent", `rate limited, retry-after ${res.headers.get("retry-after") ?? "unknown"}s`);
      return lastGood;
    }

    if (res.status === 403) {
      // Almost always the scope: a token minted without `user-read-recently-played`.
      note("recent", "403 — the token is missing the user-read-recently-played scope");
      return lastGood;
    }

    if (!res.ok) {
      note("recent", `spotify answered ${res.status} ${res.statusText}`);
      return lastGood;
    }

    const json = (await res.json()) as { items?: unknown };
    const tracks = threeUnique(json.items);

    if (tracks.length === 0) {
      note("recent", "spotify returned no playable tracks");
      return lastGood;
    }

    lastGood = tracks;
    return tracks;
  } catch (error) {
    unstable_rethrow(error);
    note("recent", error instanceof Error ? `${error.name}: ${error.message}` : String(error));
    return lastGood;
  }
}
