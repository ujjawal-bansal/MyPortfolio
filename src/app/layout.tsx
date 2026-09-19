import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Ujjawal Bansal",
    template: "%s · Ujjawal Bansal",
  },
  description: "Software developer and CS student. Somewhere between code and consciousness.",
  authors: [{ name: "Ujjawal Bansal" }],
  creator: "Ujjawal Bansal",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg text-fg">{children}</body>
    </html>
  );
}
