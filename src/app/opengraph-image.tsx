import { ImageResponse } from "next/og";
import { palette } from "@/lib/palette";
import { site } from "@/content/site";

export const alt = `${site.name}: ${site.hero.disciplines.join(" × ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card: near-black, one amber dot, the name.
 *
 * Deliberately built from the design tokens' literal values rather than CSS variables —
 * Satori resolves neither custom properties nor the site's stylesheet. Phase 8 can
 * upgrade this to embed Newsreader; the default face is clean enough for now.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: palette.ink,
        padding: "80px 96px",
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 999,
          backgroundColor: palette.amberBright,
          marginBottom: 48,
        }}
      />
      <div style={{ fontSize: 88, color: palette.ivory, letterSpacing: "-0.02em" }}>{site.name}</div>
      <div
        style={{
          marginTop: 28,
          fontSize: 26,
          color: palette.parchmentFaint,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        {site.hero.disciplines.join("   ·   ")}
      </div>
    </div>,
    size,
  );
}
