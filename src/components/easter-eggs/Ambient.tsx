"use client";

import { useEffect } from "react";
import { consoleNote, returningHint } from "@/content/easterEggs";
import { useAppStore } from "@/lib/store";

const RETURNING_VISITOR_THRESHOLD = 3;

/**
 * The quiet ones: the returning-visitor hint and the console message.
 *
 * Each watches for a condition, fires once, and then never bothers the visitor again.
 * Neither blocks anything or takes focus.
 */
export function Ambient() {
  const visits = useAppStore((s) => s.visits);
  const registerVisit = useAppStore((s) => s.registerVisit);

  /* ---- visit count + console note, once per load ---- */
  useEffect(() => {
    registerVisit();

    const style = "color:#c98f43;font-family:ui-monospace,monospace;font-size:12px";
    const body = "color:#b4ac9a;font-family:ui-monospace,monospace;font-size:12px";
    console.log(`%c${consoleNote.heading}\n%c${consoleNote.lines.join("\n")}`, style, body);
  }, [registerVisit]);

  /* Third visit onward: the hint that the terminal exists. */
  if (visits < RETURNING_VISITOR_THRESHOLD) return null;

  return (
    <p
      className="pointer-events-none fixed bottom-5 left-5 z-40 font-mono text-[0.6875rem] tracking-widest text-fg-ghost"
      title="Press it"
    >
      {returningHint}
    </p>
  );
}
