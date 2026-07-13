import type { Transition } from "framer-motion";

/**
 * The shared motion language. Every animation in the site pulls its easing,
 * duration and spring config from here — that common rhythm is what makes the
 * chapters feel like one object instead of eight separate animations.
 *
 * Cinematic means slow. If a motion feels "snappy", it is wrong for this genre.
 */

/** Signature easing — a soft, expensive-feeling ease-out. */
export const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
  fast: 0.4,
  base: 0.7,
  slow: 1.1,
  glacial: 1.6,
} as const;

/** Spring used to smooth scroll-linked motion values — this is "the camera". */
export const SPRING_SCROLL = {
  stiffness: 90,
  damping: 30,
  mass: 0.4,
} as const;

/** Looser spring for pointer parallax. */
export const SPRING_SOFT = {
  stiffness: 60,
  damping: 18,
  mass: 0.6,
} as const;

export const transitionLux = (duration = DURATION.base, delay = 0): Transition => ({
  duration,
  delay,
  ease: EASE_LUX,
});

/** Standard in-view config: fire once, slightly before fully visible. */
export const VIEWPORT_ONCE = { once: true, margin: "-12% 0px -12% 0px" } as const;
