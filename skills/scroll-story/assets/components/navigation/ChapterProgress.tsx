"use client";

import { cn } from "@/lib/utils";
import { NAV_CHAPTERS } from "@/lib/chapters";
import { useActiveChapter } from "@/hooks/useActiveChapter";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

/**
 * Fixed vertical chapter rail (desktop only). Each node marks a chapter; the
 * active one elongates and lights up.
 *
 * The nodes are REAL anchors — Lenis intercepts the click for a smooth glide,
 * but they stay keyboard-navigable links with aria-current. A progress rail
 * supplements navigation; it never replaces it.
 */
export function ChapterProgress() {
  const active = useActiveChapter();

  return (
    <nav
      aria-label="Chapter progress"
      className="fixed right-6 top-1/2 z-[65] hidden -translate-y-1/2 flex-col items-center gap-4 lg:flex"
    >
      {NAV_CHAPTERS.map((chapter) => {
        const isActive = active === chapter.id;
        return (
          <Tooltip key={chapter.id}>
            <TooltipTrigger
              render={
                <a
                  href={`#${chapter.id}`}
                  aria-label={`${chapter.index} — ${chapter.label}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center justify-center py-1"
                />
              }
            >
              <span
                className={cn(
                  "block w-[2px] rounded-full bg-foreground/25 transition-all duration-500 group-hover:bg-foreground/50",
                  isActive ? "h-7 bg-brand group-hover:bg-brand" : "h-3",
                )}
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <span className="font-mono text-[10px] tracking-widest opacity-70">
                {chapter.index}
              </span>{" "}
              {chapter.label}
            </TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
