"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { SPRING_SCROLL } from "@/lib/motion";

/**
 * A whisper-thin accent bar pinned to the top of the viewport, tracking overall
 * progress through the story. Decorative wayfinding — aria-hidden, because the
 * chapter rail is the real navigation.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SPRING_SCROLL);

  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-brand/70"
      style={{ scaleX }}
    />
  );
}
