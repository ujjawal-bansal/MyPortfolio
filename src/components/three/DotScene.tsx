"use client";

import { useEffect, useRef } from "react";
import { useHasFinePointer, useIsMobile, useReducedMotion } from "@/hooks";
import { particleWord } from "@/content/fragments";
import { createDotScene } from "@/lib/dot-scene/engine";
import type { DotSceneHandle } from "@/lib/dot-scene/types";

/**
 * The Dot, as a fixed background layer behind the whole page.
 *
 * It is purely decorative — `aria-hidden`, `pointer-events: none`, and the hero's words
 * are server-rendered above it. If this component never loads, nothing is lost but
 * atmosphere.
 *
 * Canvas 2D rather than WebGL: at these particle counts the GPU wins nothing, and 2D
 * has no context-loss story to handle and no fallback to write. The scene sits behind
 * `DotSceneHandle`, so a WebGL implementation could replace it without any section
 * knowing.
 */
export default function DotScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const hasFinePointer = useHasFinePointer();

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const styles = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback;

    /**
     * Particle budget. Scaled by width and by core count, because a 2019 midrange phone
     * and a desktop both report "mobile: false" at 900px in landscape.
     */
    const cores = navigator.hardwareConcurrency ?? 4;
    const lowPower = cores <= 4;
    const base = isMobile ? 240 : window.innerWidth >= 1280 ? 900 : 520;
    const particleCount = lowPower ? Math.round(base * 0.6) : base;

    const scene = createDotScene({
      canvas,
      particleCount,
      reducedMotion,
      pointerInfluence: hasFinePointer && !reducedMotion,
      lowPower,
      word: particleWord,
      // Resolved here: ctx.font cannot read a CSS custom property.
      fontFamily: getComputedStyle(wrapper).fontFamily || "Georgia, serif",
      colors: {
        dot: token("--dot", "#e3ac63"),
        particle: token("--parchment-faint", "#7d7668"),
        line: token("--border-strong", "#35353e"),
        accent: token("--amber", "#c98f43"),
      },
    });

    // Development-only probe, so performance can be measured from the outside rather
    // than guessed at. Stripped from production builds.
    if (process.env.NODE_ENV === "development") {
      (window as unknown as { __dotScene?: DotSceneHandle }).__dotScene = scene;
    }

    /* ---- scroll → stage + presence ---- */
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        scene.setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---- pointer ---- */
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = canvas.getBoundingClientRect();
      scene.setPointer(event.clientX - rect.left, event.clientY - rect.top);
    };
    const onPointerLeave = () => scene.setPointer(null, null);
    if (hasFinePointer && !reducedMotion) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    /* ---- resize ---- */
    const resizeObserver = new ResizeObserver(() => scene.resize());
    resizeObserver.observe(wrapper);

    /* ---- pause when unseen: off-screen, or the tab is in the background ---- */
    let onScreen = true;
    const sync = () => {
      if (reducedMotion) return;
      if (onScreen && !document.hidden) scene.resume();
      else scene.pause();
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(wrapper);

    const onVisibility = () => sync();
    document.addEventListener("visibilitychange", onVisibility);
    sync();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      if (scrollFrame) window.cancelAnimationFrame(scrollFrame);
      scene.destroy();
    };
  }, [reducedMotion, isMobile, hasFinePointer]);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      // font-serif is not decorative here: the sampler reads this element's computed
      // family to rasterise the word.
      className="pointer-events-none fixed inset-0 z-0 font-serif"
    >
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
