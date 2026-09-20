"use client";

import { useEffect, useId, useState } from "react";
import { usePathname } from "next/navigation";
import { anchorFor, navIdFor, navSections, sections } from "@/content/sections";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * Navigation as the motif rather than a navbar: one dot per section, stacked down the
 * right edge. The current section's dot fills with amber; the rest are outlines. Labels
 * stay hidden until hover or keyboard focus, so at rest it reads as punctuation.
 *
 * Accessibility notes, since "quiet" must not mean "unusable":
 * - real <a href="#id"> elements, so Tab reaches them and Enter navigates
 * - labels are always in the DOM for screen readers; only visually hidden
 * - aria-current marks the active section
 * - below `md` the rail is replaced by a labelled disclosure menu, because a column of
 *   6px targets fails every touch-target guideline there is
 *
 * It is the same navigation on every page: the home sections. On the home page the dots
 * are in-page anchors with a scroll spy; everywhere else — a case study, a 404 — those
 * sections live on the home page, so the links point back to them. On a case study the
 * Projects dot stays lit, because that is where you are.
 */
interface RailItem {
  id: string;
  navLabel: string;
}

function railFor(pathname: string): {
  items: readonly RailItem[];
  href: (id: string) => string;
  spy: readonly string[];
} {
  if (pathname === "/") {
    return { items: navSections, href: (id) => `#${id}`, spy: sections.map((s) => s.id) };
  }
  return { items: navSections, href: (id) => `/#${id}`, spy: [] };
}

export function DotNav() {
  const pathname = usePathname();
  const rail = railFor(pathname);
  const activeSection = useAppStore((s) => s.activeSection);
  const setActiveSection = useAppStore((s) => s.setActiveSection);
  // A case study belongs to Projects; keep that dot lit rather than whatever was last
  // active on the home page. Writing is not a section of this page, so nothing lights
  // there — the rail is for places on the home page, and that is a door out of it.
  const current = pathname.startsWith("/work/") ? "projects" : activeSection;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();

  // Scroll spy. IntersectionObserver rather than ScrollTrigger so it works identically
  // with Lenis running or not, and under reduced motion where Lenis never starts.
  useEffect(() => {
    const elements = railFor(pathname)
      .spy.map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // The section occupying the middle band of the viewport wins.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(navIdFor(visible.target.id));
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname, setActiveSection]);

  // Close the mobile menu on Escape, and return focus sensibly.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      {/* ---- Desktop: the dot rail ---- */}
      <nav
        data-neti-layer="interface"
        aria-label="Sections"
        className="fixed top-1/2 right-6 z-50 hidden -translate-y-1/2 md:block"
      >
        <ul className="flex flex-col items-end gap-5">
          {rail.items.map((section) => {
            const active = current === section.id;
            return (
              <li key={section.id}>
                <a
                  href={rail.href(anchorFor(section.id))}
                  aria-current={active ? "true" : undefined}
                  className="group flex items-center justify-end gap-3 py-1 outline-offset-4"
                >
                  <span
                    className={cn(
                      "font-mono text-[0.625rem] tracking-widest uppercase",
                      "translate-x-1 opacity-0 transition-all duration-300 ease-[var(--ease-out-quart)]",
                      "group-hover:translate-x-0 group-hover:opacity-100",
                      "group-focus-visible:translate-x-0 group-focus-visible:opacity-100",
                      active ? "text-accent" : "text-fg-faint",
                    )}
                  >
                    {section.navLabel}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "size-1.5 shrink-0 rounded-full transition-all duration-300 ease-[var(--ease-out-quart)]",
                      active
                        ? "scale-125 bg-accent"
                        : "bg-fg-faint/40 group-hover:bg-fg-muted group-focus-visible:bg-fg-muted",
                    )}
                    style={active ? { boxShadow: "0 0 12px var(--dot-glow)" } : undefined}
                  />
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ---- Mobile: one dot that opens a real menu ---- */}
      <div data-neti-layer="interface" className="fixed top-4 right-4 z-50 md:hidden">
        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls={menuId}
          className="flex size-11 items-center justify-center rounded-full border border-line bg-bg-raised/80 backdrop-blur-sm"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <span
            aria-hidden
            className={cn(
              "rounded-full transition-all duration-300 ease-[var(--ease-out-quart)]",
              menuOpen ? "size-3 bg-accent" : "size-1.5 bg-fg-muted",
            )}
            style={menuOpen ? { boxShadow: "0 0 12px var(--dot-glow)" } : undefined}
          />
        </button>

        <div
          id={menuId}
          hidden={!menuOpen}
          className="absolute top-13 right-0 min-w-44 rounded-lg border border-line bg-bg-raised/95 p-2 shadow-2xl backdrop-blur-sm"
        >
          <ul>
            {rail.items.map((section) => (
              <li key={section.id}>
                <a
                  href={rail.href(anchorFor(section.id))}
                  onClick={() => setMenuOpen(false)}
                  aria-current={current === section.id ? "true" : undefined}
                  className={cn(
                    // py-3.5 puts the tap target at 44px; anything less is fiddly on a phone.
                    "block rounded px-3 py-3.5 font-mono text-xs tracking-wide uppercase",
                    current === section.id ? "text-accent" : "text-fg-muted",
                  )}
                >
                  {section.navLabel}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
