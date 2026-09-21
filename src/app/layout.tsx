import type { Metadata, Viewport } from "next";
import { DEFAULT_THEME, themeScript } from "@/lib/theme";
import { EnhancementsLazy } from "@/components/easter-eggs/EnhancementsLazy";
import { Enter } from "@/components/loader/Enter";
import { DotNav } from "@/components/ui/DotNav";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SkipLink } from "@/components/ui/SkipLink";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/site-url";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

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
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // The inline script below writes data-theme before hydration, so the server's
      // markup and the client's first render disagree by design.
      suppressHydrationWarning
      data-theme={DEFAULT_THEME}
      className={`${fontVariables} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {/*
          No JavaScript, no entrance. The overlay is server-rendered so it paints
          immediately, which means without this it would sit there forever.
        */}
        <noscript>
          <style>{`#enter{display:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col bg-bg text-fg">
        <SkipLink />
        <SmoothScroll>
          <Enter />
          <DotNav />
          <ThemeToggle />
          {children}
        </SmoothScroll>
        <EnhancementsLazy />
      </body>
    </html>
  );
}
