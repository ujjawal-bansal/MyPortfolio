/**
 * The canonical origin, in one place.
 *
 * Vercel injects `VERCEL_PROJECT_PRODUCTION_URL` (no protocol) for production
 * deployments, which makes previews and production both resolve correctly without
 * anyone remembering to set anything. `NEXT_PUBLIC_SITE_URL` overrides it once there is
 * a real domain; localhost is the last resort so the build never bakes in a guess.
 */
function resolve(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export const siteUrl = resolve();
