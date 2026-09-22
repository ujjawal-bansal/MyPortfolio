import type { NextConfig } from "next";

import { isPending } from "./src/content/types";
import { site } from "./src/content/site";

/**
 * Short links that outlive the page they point at.
 *
 * `ujjawal.tech/resume` is the address that goes on an application form, so it has to
 * stay typeable and stay correct. The destination lives in `src/content/site.ts` with
 * the rest of the copy; this only forwards to it.
 *
 * Temporary (307), not permanent: the Drive file can be swapped for a newer résumé, and
 * a 308 would sit in visitors' browser caches pointing at the old one long after.
 */
function resumeRedirects() {
  const { href } = site.resume;
  if (isPending(href)) return [];

  // `cv` is already an alias for `resume` in the site's terminal; match that vocabulary.
  return ["/resume", "/cv"].map((source) => ({
    source,
    destination: href,
    permanent: false,
  }));
}

const nextConfig: NextConfig = {
  images: {
    // Book covers in "Current reads": Open Library for the list in content/reading.ts,
    // Goodreads' image host when the shelf comes from Goodreads.
    remotePatterns: [
      { protocol: "https", hostname: "covers.openlibrary.org", pathname: "/b/id/**" },
      { protocol: "https", hostname: "i.gr-assets.com" },
    ],
  },

  async redirects() {
    return resumeRedirects();
  },
};

export default nextConfig;
