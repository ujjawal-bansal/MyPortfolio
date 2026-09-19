"use client";

import dynamic from "next/dynamic";

/**
 * The scene is loaded client-side only and is never awaited by anything visible.
 * There is no loading state on purpose: the correct placeholder for "particles have
 * not arrived yet" is the dark background they sit on.
 */
export const DotSceneLazy = dynamic(() => import("./DotScene"), {
  ssr: false,
  loading: () => null,
});
