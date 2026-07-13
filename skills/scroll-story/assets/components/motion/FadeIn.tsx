"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { DURATION, EASE_LUX, VIEWPORT_ONCE } from "@/lib/motion";
import { useReducedMotionPref } from "@/hooks/useReducedMotionPref";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  /** vertical travel (px). */
  y?: number;
  once?: boolean;
  className?: string;
}

/** Entrance-on-scroll: fades + rises once. Under reduced motion it just renders. */
export function FadeIn({
  children,
  delay = 0,
  duration = DURATION.base,
  y = 26,
  once = true,
  className,
}: FadeInProps) {
  const { reduced } = useReducedMotionPref();

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={once ? VIEWPORT_ONCE : { once: false, margin: "-12% 0px" }}
      transition={{ duration, delay, ease: EASE_LUX }}
    >
      {children}
    </motion.div>
  );
}
