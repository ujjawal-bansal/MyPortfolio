/**
 * Mints a Spotify refresh token, once, on this machine.
 *
 * The site needs a refresh token to read your listening history while nobody is signed
 * in. Getting one requires you to approve the app in a browser, which is not something a
 * build can do — so it happens here, by hand, and the result goes into an environment
 * variable and is never needed again.
 *
 *   node scripts/spotify-token.mjs
 *
 * Reads SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET from the environment (or .env.local).
 * Prints the refresh token to this terminal and nowhere else: no file is written, nothing
 * is sent anywhere except Spotify, and the local server stops the moment it has an answer.
 *
 * The redirect URI must be registered on the app at developer.spotify.com, exactly:
 *
 *   http://127.0.0.1:8888/callback
 *
 * Spotify rejects `localhost` for new apps and requires the loopback IP, so this is not
 * interchangeable with the spelling you may have seen in older guides.
 */

import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;

/** The only scope this site needs, and the only one it should ever be granted. */
const SCOPE = "user-read-recently-played";

/**
 * A token granted with only this scope *cannot* read what is playing now, however the
 * code is later changed. That is the guarantee the section makes; approving anything
 * wider here would quietly remove it.
 */

function fromEnvFile(name) {
  try {
    const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const line = text.split("\n").find((entry) => entry.trim().startsWith(`${name}=`));
    if (!line) return undefined;
    return line
      .slice(line.indexOf("=") + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
  } catch {
    return undefined;
  }
}

const clientId = process.env.SPOTIFY_CLIENT_ID?.trim() || fromEnvFile("SPOTIFY_CLIENT_ID");
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim() || fromEnvFile("SPOTIFY_CLIENT_SECRET");

if (!clientId || !clientSecret) {
  console.error(
    [
      "",
      "  Missing credentials.",
      "",
      "  Create an app at https://developer.spotify.com/dashboard, add",
      `  ${REDIRECT_URI} as a redirect URI, then put its id and secret in`,
      "  .env.local:",
      "",
      "    SPOTIFY_CLIENT_ID=...",
      "    SPOTIFY_CLIENT_SECRET=...",
      "",
      "  No quotes around the values.",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

/** Guards against a stray request to the callback being treated as the real one. */
const state = randomBytes(16).toString("hex");

const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  response_type: "code",
  client_id: clientId,
  scope: SCOPE,
  redirect_uri: REDIRECT_URI,
  state,
  // Forces the approval screen even if this app was authorised before, so re-running
  // after revoking a token actually issues a new one instead of silently reusing.
  show_dialog: "true",
})}`;

function page(title, body) {
  return `<!doctype html><meta charset="utf-8"><title>${title}</title>
<body style="background:#0b0b0e;color:#e6dfcd;font:16px/1.6 ui-serif,Georgia,serif;display:grid;place-items:center;height:100vh;margin:0">
<div style="max-width:32rem;padding:2rem;text-align:center"><p>${body}</p></div>`;
}

async function exchange(code) {
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const json = await res.json();
  if (!res.ok) throw new Error(`${res.status} ${JSON.stringify(json)}`);
  return json;
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }

  const error = url.searchParams.get("error");
  if (error) {
    res.writeHead(400, { "content-type": "text/html" }).end(page("Denied", `Spotify said: ${error}`));
    console.error(`\n  Spotify returned: ${error}\n`);
    server.close();
    process.exitCode = 1;
    return;
  }

  if (url.searchParams.get("state") !== state) {
    res
      .writeHead(400, { "content-type": "text/html" })
      .end(page("Mismatch", "Unexpected state. Start again."));
    return;
  }

  const code = url.searchParams.get("code");
  if (!code) {
    res
      .writeHead(400, { "content-type": "text/html" })
      .end(page("No code", "No authorisation code came back."));
    return;
  }

  try {
    const token = await exchange(code);
    res
      .writeHead(200, { "content-type": "text/html" })
      .end(page("Done", "Approved. The refresh token is in your terminal — you can close this tab."));

    console.log(
      [
        "",
        "  Add this to .env.local and to Vercel (Production), with no quotes:",
        "",
        `    SPOTIFY_REFRESH_TOKEN=${token.refresh_token}`,
        "",
        `  Scope granted: ${token.scope}`,
        "",
        "  Check the app dashboard for its lifetime — 180 days is typical — and re-run",
        "  this script when it lapses. The site falls back to its drawn waveform in the",
        "  meantime and logs `the refresh token is no longer valid` to the runtime log.",
        "",
        "  Treat it like a password: anyone holding it, together with the client id and",
        "  secret, can read your listening history. Rotating the client secret in the",
        "  dashboard invalidates it too, so rotate first and mint second, not the reverse.",
        "",
      ].join("\n"),
    );
  } catch (cause) {
    res
      .writeHead(500, { "content-type": "text/html" })
      .end(page("Failed", "The exchange failed. See the terminal."));
    console.error(`\n  Token exchange failed: ${cause.message}\n`);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(
    [
      "",
      "  Open this, approve, and come back:",
      "",
      `  ${authorizeUrl}`,
      "",
      `  (Waiting on ${REDIRECT_URI} — Ctrl-C to stop.)`,
      "",
    ].join("\n"),
  );
});
