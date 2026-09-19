"use client";

import { useSyncExternalStore } from "react";

export type WebGLSupport = "probing" | "supported" | "unsupported";

/** One-off probe: a throwaway context is cheaper than mounting a canvas that fails. */
function detectWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    // Free the context immediately; browsers cap how many can be live at once.
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// Capability of the machine, not of the session — probe once per page load.
let cached: WebGLSupport | null = null;

function subscribe() {
  // Nothing to listen to: support cannot change while the page is open.
  return () => {};
}

function getSnapshot(): WebGLSupport {
  cached ??= detectWebGL() ? "supported" : "unsupported";
  return cached;
}

function getServerSnapshot(): WebGLSupport {
  return "probing";
}

/**
 * Whether this browser can run our 3D scenes.
 *
 * Reports `"probing"` through SSR and hydration, so the static fallback is what
 * first paints and no canvas is mounted the client cannot honour. Resolves on
 * the commit right after hydration.
 */
export function useWebGLSupport(): WebGLSupport {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
