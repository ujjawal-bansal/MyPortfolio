"use client";

import { Observer } from "@/components/ui/Observer";
import { Ambient } from "./Ambient";
import { NetiNeti } from "./NetiNeti";
import { Terminal } from "./Terminal";

/**
 * Everything the page is better with but does not need in order to be read.
 *
 * Grouped into one lazily-loaded chunk so the cursor dot, the terminal, the removal
 * sequence and the ambient eggs stay off the critical path. None of them renders
 * anything above the fold; all of them cost parse time on a slow phone if shipped eagerly.
 *
 * The ⌘K listener registers when this chunk lands — a moment after hydration, which is
 * far sooner than anyone reaches for it.
 */
export default function Enhancements() {
  return (
    <>
      <Observer />
      <Terminal />
      <NetiNeti />
      <Ambient />
    </>
  );
}
