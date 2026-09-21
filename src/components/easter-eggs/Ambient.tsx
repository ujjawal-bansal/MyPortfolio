"use client";

import { useEffect } from "react";
import { consoleNote } from "@/content/easterEggs";

/**
 * The console note, once per page load.
 *
 * `greeted` is module scope so it resets on a real page load rather than a re-render:
 * React StrictMode double-invokes effects in development, which printed it twice.
 *
 * This used to also show a ⌘K hint in the corner on a third visit, which is why the
 * store counted visits in localStorage. Both are gone — the hint was chrome nobody asked
 * for, and the visit count it depended on had no other reader.
 */
let greeted = false;

export function Ambient() {
  useEffect(() => {
    if (greeted) return;
    greeted = true;

    const style = "color:#c98f43;font-family:ui-monospace,monospace;font-size:12px";
    const body = "color:#b4ac9a;font-family:ui-monospace,monospace;font-size:12px";
    console.log(`%c${consoleNote.heading}\n%c${consoleNote.lines.join("\n")}`, style, body);
  }, []);

  return null;
}
