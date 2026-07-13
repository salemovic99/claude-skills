"use client";

import { type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { ReducedMotionProvider, useReducedMotionPref } from "@/hooks/useReducedMotionPref";
import { useLenis } from "@/hooks/useLenis";
import { EASE_LUX, DURATION } from "@/lib/motion";
import { TooltipProvider } from "@/components/ui/tooltip";

function ExperienceRuntime({ children }: { children: ReactNode }) {
  const { userReduced } = useReducedMotionPref();
  // Inertial smooth-scroll; self-disables under reduced motion.
  useLenis();

  return (
    <MotionConfig
      // "user" already respects the OS setting. Flipping to "always" is what the
      // in-app toggle does — forcing reduction even when the OS says nothing.
      reducedMotion={userReduced ? "always" : "user"}
      transition={{ duration: DURATION.base, ease: EASE_LUX }}
    >
      <TooltipProvider>{children}</TooltipProvider>
    </MotionConfig>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ReducedMotionProvider>
      <ExperienceRuntime>{children}</ExperienceRuntime>
    </ReducedMotionProvider>
  );
}
