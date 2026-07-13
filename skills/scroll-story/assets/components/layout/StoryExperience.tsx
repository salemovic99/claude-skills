"use client";

import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ChapterNav } from "@/components/navigation/ChapterNav";
import { ChapterProgress } from "@/components/navigation/ChapterProgress";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Vision } from "@/components/sections/Vision";
import { Mission } from "@/components/sections/Mission";
import { Values } from "@/components/sections/Values";
import { Work } from "@/components/sections/Work";
import { ComingSoon } from "@/components/sections/ComingSoon";
import { Contact } from "@/components/sections/Contact";

/**
 * THE single client tree for the whole experience: the fixed background, the
 * fixed wayfinding, and every chapter in scroll order.
 *
 * app/page.tsx renders this and nothing else, which keeps layout.tsx and
 * page.tsx as Server Components.
 */
export function StoryExperience() {
  return (
    <>
      <ScrollProgress />
      <ChapterNav />
      <ChapterProgress />

      <main id="story" className="relative">
        <Hero />
        <About />
        <Vision />
        <Mission />
        <Values />
        <Work />
        <ComingSoon />
        <Contact />
      </main>
    </>
  );
}
