import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { postBySlug, posts } from "@/content/writing";
import { palette } from "@/lib/palette";

export const alt = "Writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

/**
 * One social card per post. Posts get shared more than anything else on the site, so the
 * card leads with the pivot — the line each piece was built around — rather than with a
 * truncated first paragraph.
 *
 * Satori resolves neither CSS custom properties nor the site stylesheet, so the palette
 * comes from lib/palette.ts, which is the single source these literals share with
 * globals.css.
 */
export default async function WritingImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = postBySlug(slug);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: palette.ink,
        padding: "72px 96px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: palette.amberBright }} />
        <div style={{ fontSize: 22, color: palette.parchmentFaint, letterSpacing: "0.2em" }}>
          {site.name.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 82, color: palette.ivory, letterSpacing: "-0.02em" }}>
          {post?.title ?? "Writing"}
        </div>
        <div style={{ marginTop: 24, fontSize: 32, color: palette.amber, fontStyle: "italic" }}>
          {post?.pivot ?? ""}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ fontSize: 19, color: palette.parchmentGhost, letterSpacing: "0.14em" }}>
          PHILOSOPHY × ENGINEERING
        </div>
      </div>
    </div>,
    size,
  );
}
