import { fragments } from "@/content/fragments";
import { cn } from "@/lib/utils";

/**
 * Floating fragments: a handful of code tokens, logic symbols and Devanagari
 * letterforms drifting behind the hero. DOM text rather than canvas, so they stay
 * crisp at any resolution and cost nothing per frame.
 *
 * `aria-hidden` — they are texture, not content, and a screen reader announcing
 * "const, therefore, अ" would be nonsense.
 */
export function Fragments() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {fragments.map((fragment, index) => (
        <span
          key={`${fragment.text}-${index}`}
          className={cn(
            "absolute block select-none motion-safe:animate-drift",
            fragment.kind === "code" && "font-mono text-fg-faint/35",
            fragment.kind === "math" && "font-serif text-blue/40",
            fragment.kind === "devanagari" && "text-accent-dim/40",
          )}
          {...(fragment.kind === "devanagari" ? { lang: "sa" } : {})}
          style={{
            left: `${fragment.x}%`,
            top: `${fragment.y}%`,
            fontSize: `${fragment.scale}rem`,
            animationDuration: `${fragment.duration}s`,
            animationDelay: `${fragment.delay}s`,
          }}
        >
          {fragment.text}
        </span>
      ))}
    </div>
  );
}
