"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { banner, completionsFor, notFound, prompt, resolveCommand } from "@/content/terminal";
import { useAppStore } from "@/lib/store";

/**
 * The hidden terminal. ⌘K / Ctrl+K from anywhere.
 *
 * Deliberately not a fuzzy command palette: it is a prompt you type into, because the
 * bridge between the programming half of this site and the philosophical half is more
 * interesting when it asks you to know what to say.
 *
 * Tab completes, ↑/↓ walk the history, Esc leaves. Tab is spent on completion rather
 * than focus movement, which would normally be a keyboard trap — Esc always exits, and
 * Shift+Tab reaches the close button, so there is always a way out.
 */

interface Line {
  id: number;
  kind: "input" | "output";
  text: string;
}

let lineId = 0;

export function Terminal() {
  const open = useAppStore((s) => s.terminalOpen);
  const toggleTerminal = useAppStore((s) => s.toggleTerminal);
  const closeTerminal = useAppStore((s) => s.closeTerminal);
  const startNetiNeti = useAppStore((s) => s.startNetiNeti);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  const [value, setValue] = useState("");
  const [lines, setLines] = useState<Line[]>(() =>
    banner.map((text) => ({ id: lineId++, kind: "output" as const, text })),
  );
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);

  const push = useCallback((kind: Line["kind"], text: string) => {
    setLines((current) => [...current, { id: lineId++, kind, text }]);
  }, []);

  /* ---- global hotkey ---- */
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        restoreFocusTo.current = document.activeElement as HTMLElement | null;
        toggleTerminal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleTerminal]);

  /* ---- focus in, focus back ---- */
  useEffect(() => {
    if (open) inputRef.current?.focus();
    else restoreFocusTo.current?.focus?.();
  }, [open]);

  /* ---- keep the newest line in view ---- */
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines]);

  const submit = useCallback(
    (raw: string) => {
      const input = raw.trim();
      push("input", `${prompt} $ ${input}`);
      if (input) setHistory((h) => [...h, input]);
      setHistoryIndex(null);
      setValue("");
      if (!input) return;

      const [name, ...args] = input.split(/\s+/);
      const command = resolveCommand(name);

      if (!command) {
        for (const line of notFound(name)) push("output", line);
        return;
      }

      const result = command.run(args);

      if (result.effect === "clear") {
        setLines([]);
        return;
      }

      for (const line of result.lines) push("output", line);

      if (result.effect === "close") {
        window.setTimeout(() => closeTerminal(), 450);
      }
      if (result.effect === "neti-neti") {
        window.setTimeout(() => {
          closeTerminal();
          startNetiNeti();
        }, 700);
      }
      if (result.navigate) {
        window.setTimeout(() => {
          closeTerminal();
          router.push(result.navigate!);
        }, 350);
      }
      if (result.externalHref) {
        window.open(result.externalHref, "_blank", "noopener,noreferrer");
      }
    },
    [push, closeTerminal, startNetiNeti, router],
  );

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeTerminal();
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      submit(value);
      return;
    }

    if (event.key === "Tab" && !event.shiftKey) {
      // Tab completes rather than moving focus. Shift+Tab still leaves, and so does Esc.
      event.preventDefault();
      const options = completionsFor(value);
      if (options.length === 1) {
        setValue(options[0] + " ");
      } else if (options.length > 1) {
        push("output", options.join("   "));
      }
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length === 0) return;
      const next = historyIndex === null ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(next);
      setValue(history[next]);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex === null) return;
      const next = historyIndex + 1;
      if (next >= history.length) {
        setHistoryIndex(null);
        setValue("");
      } else {
        setHistoryIndex(next);
        setValue(history[next]);
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center p-4 pt-[12vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeTerminal();
      }}
    >
      <div aria-hidden className="fixed inset-0 bg-void/80 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="relative flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-line bg-bg-raised shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line/70 px-4 py-2.5">
          <span className="font-mono text-[0.6875rem] tracking-wide text-fg-faint">{prompt}</span>
          <button
            ref={closeRef}
            type="button"
            onClick={closeTerminal}
            className="font-mono text-[0.625rem] tracking-[0.15em] text-fg-faint uppercase hover:text-accent"
          >
            Esc
          </button>
        </div>

        <div
          ref={logRef}
          className="flex-1 overflow-y-auto overscroll-contain px-4 py-3 font-mono text-xs leading-relaxed"
          aria-live="polite"
        >
          {lines.map((line) => (
            <p
              key={line.id}
              className={line.kind === "input" ? "text-accent" : "text-fg-muted"}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {line.text || " "}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t border-line/70 px-4 py-3">
          <span aria-hidden className="font-mono text-xs text-accent">
            $
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            className="flex-1 bg-transparent font-mono text-xs text-fg-strong outline-none placeholder:text-fg-ghost"
            placeholder="help"
          />
        </div>
      </div>
    </div>
  );
}
