"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useHasFinePointer, useReducedMotion } from "@/hooks";

/**
 * The observer: one small dot that follows the cursor a beat behind.
 *
 * It does not replace the system cursor — that would cost more in usability than it
 * buys in atmosphere. It sits alongside it, slightly late, and opens up over anything
 * interactive. The witness that is always present and never explained (BRIEF §13).
 *
 * Renders nothing at all for touch input or reduced motion.
 */
export function Observer() {
  const hasFinePointer = useHasFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = hasFinePointer && !reducedMotion;

  const dotRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dot = dotRef.current;
    if (!enabled || !dot) return;

    // Centre the dot on the pointer inside GSAP's transform rather than with a
    // Tailwind translate class — two systems writing transforms is asking for trouble.
    gsap.set(dot, { xPercent: -50, yPercent: -50 });

    // quickTo keeps one tween alive per axis instead of allocating a new one per move.
    const moveX = gsap.quickTo(dot, "x", { duration: 0.55, ease: "power3.out" });
    const moveY = gsap.quickTo(dot, "y", { duration: 0.55, ease: "power3.out" });

    const interactive =
      "a, button, input, textarea, select, summary, [role='button'], [tabindex]:not([tabindex='-1'])";

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      setVisible(true);
      moveX(event.clientX);
      moveY(event.clientY);

      const over = (event.target as Element | null)?.closest?.(interactive);
      gsap.to(dot, {
        scale: over ? 2.6 : 1,
        opacity: over ? 0.75 : 1,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      gsap.killTweensOf(dot);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-60 size-1.5 rounded-full"
      style={{
        backgroundColor: "var(--dot)",
        boxShadow: "0 0 16px var(--dot-glow)",
        opacity: visible ? 1 : 0,
        transition: "opacity 300ms var(--ease-out-quart)",
        willChange: "transform",
      }}
    />
  );
}
