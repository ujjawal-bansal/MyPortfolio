import { mainContentId } from "@/content/sections";

/**
 * Visible only on focus. First thing in the tab order, so a keyboard user is not
 * dragged through the whole nav rail to reach the page.
 */
export function SkipLink() {
  return (
    <a
      href={`#${mainContentId}`}
      className="sr-only rounded-md border border-line bg-bg-raised px-4 py-2 font-mono text-sm text-fg-strong focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[70] focus-visible:ring-accent"
    >
      Skip to content
    </a>
  );
}
