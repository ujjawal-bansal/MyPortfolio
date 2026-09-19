import type { Metadata, Viewport } from "next";
import { DotSceneLazy } from "@/components/three/DotSceneLazy";
import { DotNav } from "@/components/ui/DotNav";
import { Observer } from "@/components/ui/Observer";
import { SkipLink } from "@/components/ui/SkipLink";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { site } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

/**
 * No canonical domain yet — set NEXT_PUBLIC_SITE_URL at deploy time (Phase 8) so
 * Open Graph URLs resolve absolutely. Until then localhost keeps the build honest
 * rather than baking in a guessed domain.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: site.meta.title,
    template: `%s · ${site.name}`,
  },
  description: site.meta.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "profile",
    siteName: site.name,
    title: site.meta.title,
    description: site.meta.description,
    url: "/",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: site.meta.title,
    description: site.meta.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <SkipLink />
        <DotSceneLazy />
        <SmoothScroll>
          <DotNav />
          <Observer />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
