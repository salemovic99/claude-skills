"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { SPRING_SOFT } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useIsMobile } from "@/hooks/useIsMobile";

/**
 * Pointer position across the viewport as two spring-smoothed motion values in
 * [-0.5, 0.5]. Disabled under reduced motion and on touch/mobile (no meaningful
 * pointer), where both rest at 0 — so callers need no branch of their own.
 */
export function useMouseParallax(): { x: MotionValue<number>; y: MotionValue<number> } {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING_SOFT);
  const y = useSpring(rawY, SPRING_SOFT);

  const { reduced } = useReducedMotionPref();
  const isMobile = useIsMobile();
  const enabled = !reduced && !isMobile;

  useEffect(() => {
    if (!enabled) {
      rawX.set(0);
      rawY.set(0);
      return;
    }
    const onMove = (event: PointerEvent) => {
      rawX.set(event.clientX / window.innerWidth - 0.5);
      rawY.set(event.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);

  return { x, y };
}
