import { ImageResponse } from "next/og";
import { projectBySlug, projects } from "@/content/projects";
import { palette } from "@/lib/palette";
import { site } from "@/content/site";

export const alt = "Case study";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

/**
 * One social card per case study. Satori resolves neither CSS custom properties nor the
 * site stylesheet, so the palette is repeated here as literals — the same values as
 * globals.css.
 */
export default async function CaseStudyImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projectBySlug(slug);

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
          {project?.name ?? "Case study"}
        </div>
        <div style={{ marginTop: 20, fontSize: 30, color: palette.parchmentDim }}>
          {project?.tagline ?? ""}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {project?.status === "live" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              border: "1px solid rgba(74,107,85,0.6)",
              borderRadius: 999,
              padding: "6px 18px",
              fontSize: 19,
              color: palette.forestBright,
              letterSpacing: "0.14em",
            }}
          >
            <div style={{ width: 9, height: 9, borderRadius: 999, backgroundColor: palette.forestBright }} />
            LIVE IN PRODUCTION
          </div>
        ) : null}
        <div style={{ fontSize: 19, color: palette.parchmentGhost, letterSpacing: "0.14em" }}>
          {(project?.stack ?? [])
            .flatMap((group) => group.items)
            .slice(0, 4)
            .join("  ·  ")}
        </div>
      </div>
    </div>,
    size,
  );
}
