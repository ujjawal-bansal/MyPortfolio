/**
 * Shared content primitives.
 *
 * Everything the site says lives in `src/content/*.ts`. Components read this data;
 * they never hard-code copy. Anything Ujjawal still has to supply is marked `PENDING`
 * rather than invented, and components are expected to check for it.
 */

/** Sentinel for content that is deliberately not written yet. */
export const PENDING = "__PENDING__" as const;
export type Pending = typeof PENDING;

/** A value that may not have been supplied yet. */
export type Maybe<T> = T | Pending;

export function isPending<T>(value: Maybe<T>): value is Pending {
  return value === PENDING;
}

/** Narrow a `Maybe<T>` to `T`, or fall back. Handy in components. */
export function orElse<T>(value: Maybe<T>, fallback: T): T {
  return isPending(value) ? fallback : value;
}

export interface Link {
  label: string;
  href: Maybe<string>;
  /** Shown instead of the raw URL, e.g. "@ujjawal-bansal". */
  display?: Maybe<string>;
  external?: boolean;
}

/** A citation that traces a line back to SOURCES.md. Nothing Sanskrit ships without one. */
export interface Citation {
  /** Work it comes from, e.g. "Bṛhadāraṇyaka Upaniṣad". */
  text: string;
  /** Chapter and verse, e.g. "1.4.10". */
  location: string;
  /** Veda, school, or era — whatever situates it. */
  tradition?: string;
  /** Alternative numbering, disputed attribution, translator — anything a reader deserves. */
  note?: string;
}
