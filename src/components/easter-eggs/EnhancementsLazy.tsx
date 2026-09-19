"use client";

import dynamic from "next/dynamic";

/** Client-only, loaded after hydration. No loading state: there is nothing to see yet. */
export const EnhancementsLazy = dynamic(() => import("./Enhancements"), {
  ssr: false,
  loading: () => null,
});
