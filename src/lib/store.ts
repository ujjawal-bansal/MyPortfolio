"use client";

import { create } from "zustand";

/**
 * One tiny global store plus an event bus, so the easter eggs built in Phase 7 have
 * somewhere to plug in without threading props through every section.
 *
 * Zustand rather than context: the terminal hotkey, the idle timer and the scroll spy
 * all write from outside React's tree, and a context provider would re-render every
 * consumer on each write. Subscribers here pick their own slice.
 */

export type NetiNetiPhase = "idle" | "removing" | "void" | "returning";

export interface AppState {
  // ---- Hidden terminal (Cmd/Ctrl + K) ---------------------------------------
  terminalOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;

  // ---- Neti Neti: progressively strip the page back to nothing ---------------
  netiNeti: NetiNetiPhase;
  /** How many layers have been removed. Phase 7 decides what each layer is. */
  netiNetiStep: number;
  startNetiNeti: () => void;
  stepNetiNeti: () => void;
  endNetiNeti: () => void;

  // ---- Scroll position ------------------------------------------------------
  activeSection: string;
  setActiveSection: (id: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  terminalOpen: false,
  openTerminal: () => {
    set({ terminalOpen: true });
    emit("terminal:open", undefined);
  },
  closeTerminal: () => {
    set({ terminalOpen: false });
    emit("terminal:close", undefined);
  },
  toggleTerminal: () => (get().terminalOpen ? get().closeTerminal() : get().openTerminal()),

  netiNeti: "idle",
  netiNetiStep: 0,
  startNetiNeti: () => {
    set({ netiNeti: "removing", netiNetiStep: 0 });
    emit("netiNeti:start", undefined);
  },
  stepNetiNeti: () => set((s) => ({ netiNetiStep: s.netiNetiStep + 1 })),
  endNetiNeti: () => {
    set({ netiNeti: "idle", netiNetiStep: 0 });
    emit("netiNeti:end", undefined);
  },

  activeSection: "hero",
  setActiveSection: (id) => {
    if (get().activeSection === id) return;
    set({ activeSection: id });
    emit("section:enter", { id });
  },
}));

/* -------------------------------------------------------------------------- */
/*  Event bus                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Named one-off events, for things that are moments rather than state — a konami
 * sequence completing, an idle timer firing. State belongs in the store above.
 */
export interface AppEvents {
  "terminal:open": undefined;
  "terminal:close": undefined;
  "netiNeti:start": undefined;
  "netiNeti:end": undefined;
  "section:enter": { id: string };
  idle: { ms: number };
  konami: undefined;
}

type Handler<K extends keyof AppEvents> = (payload: AppEvents[K]) => void;

const handlers = new Map<keyof AppEvents, Set<Handler<never>>>();

/** Subscribe. Returns the unsubscribe function, so it drops straight into useEffect. */
export function on<K extends keyof AppEvents>(event: K, handler: Handler<K>): () => void {
  let set = handlers.get(event);
  if (!set) {
    set = new Set();
    handlers.set(event, set);
  }
  set.add(handler as Handler<never>);
  return () => {
    set.delete(handler as Handler<never>);
  };
}

export function emit<K extends keyof AppEvents>(event: K, payload: AppEvents[K]): void {
  const set = handlers.get(event);
  if (!set) return;
  for (const handler of set) (handler as Handler<K>)(payload);
}
