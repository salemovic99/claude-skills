---
name: scroll-story
description: Build scroll-driven cinematic narrative websites — pinned chapter runways, portal-dive section transitions, scroll-scrubbed text, horizontal camera pans, and inertial smooth-scroll — on Next.js + React + Tailwind v4 + Framer Motion + Lenis. Use when the request is for an immersive, cinematic, editorial, or storytelling site; a scrollytelling experience; a brand "journey" landing page; pinned/sticky scroll sections; a scroll-linked animation rig; or a single-page site where sections dissolve into each other rather than stacking. Brand-agnostic — palette, fonts, chapters, and copy are inputs you supply per project.
---

# Scroll Story

A production-tested engine for sites that read as one continuous vertical journey instead of a stack of sections. Every chapter is a tall scroll runway holding a sticky full-viewport panel; scroll progress drives a spring-smoothed "camera" that flies through each panel into the next.

The core insight: **there is one motion primitive** (map a section's `useScroll` progress onto composited transforms) and every set-piece — a portal dive, a word-by-word illumination, a horizontal pan, a countdown scrub — is that primitive with different ranges. Learn the primitive, then pick rigs from the catalog.

## When to use this

Use it for: cinematic/immersive/storytelling landing pages, brand journey sites, scrollytelling, pinned scroll sections, scroll-linked animation.

Do **not** use it for: dashboards, admin panels, apps, docs, or any content-dense site where users scan rather than travel. Pinned runways multiply scroll distance — that is a feature for a story and a defect for a product. For those, use the `ui-ux-pro-max` skills instead.

## The six rules

These are load-bearing. Violating any one of them is how this architecture degrades into jank.

1. **One client tree.** `app/layout.tsx` and `app/page.tsx` stay Server Components. A single `<StoryExperience/>` client component holds every chapter. Providers (MotionConfig, reduced-motion context, Lenis, Tooltip) wrap it once.
2. **Animate only `transform`, `opacity`, and `filter`.** Never animate layout properties (width, height, top, margin). `will-change` is scoped to elements that are actually moving.
3. **Reduced motion has three layers**, and every rig honors all three: a global `MotionConfig reducedMotion="user"`, a persisted user toggle that forces reduction site-wide, and a per-component static branch for anything infinite or scroll-scrubbed. A CSS `@media (prefers-reduced-motion)` floor backs it up. A rig without a `reduced` branch is unfinished.
4. **Mobile flattens.** `translateZ`, `perspective`, and `blur` are expensive and on phones they buy nothing. `useIsMobile()` drops them and shortens the runways.
5. **Scroll progress is spring-smoothed, never raw.** Raw `scrollYProgress` reads every wheel tick and stutters. `useSpring(progress, SPRING_SCROLL)` is the camera.
6. **Every rig is reversible.** Scroll up and the animation runs backwards to its exact start state. This falls out of driving motion from scroll position rather than from triggered timelines — do not reach for `useState` + entry triggers to fake it.

## Build sequence

**1 — Gather the brand inputs.** You cannot build this generically; the story is the design. Ask for, or propose and confirm:

- **Chapters**: an ordered list, each with a label, the single question it answers, and a light/dark tone. Six to eight is the working range — fewer feels thin, more exhausts the scroll budget.
- **Palette**: background, foreground, and one brand accent used *sparingly* (glows, focus rings, key words). Cinematic sites are near-monochrome with one voice.
- **Type**: a display face, a body sans, and a mono for eyebrows/chapter numbers. Three, no more.
- **The signature moment** per chapter — the one thing the visitor remembers. Pick from `references/rigs.md`; do not invent a rig before reading the catalog.

**2 — Scaffold.** Follow `references/architecture.md` for the exact file layout, provider tree, token setup, and Tailwind v4 `@theme` block. Copy the primitives from `assets/` verbatim — they are the working versions, not sketches, and they already encode rules 2–6.

**3 — Build chapters one at a time, in scroll order.** Each chapter is either:
   - a **shell chapter** — composes `<SectionShell>` and gets the shared portal dive for free (this should be most of them), or
   - a **bespoke rig** — implements its own pinned runway from `useSectionScroll` (reserve for the two or three set-pieces that carry the site).

   Content lives in `lib/content.ts`, chapter metadata in `lib/chapters.ts`. Components import copy; they never hardcode it.

**4 — Wire the wayfinding.** Scroll progress bar, chapter rail, chapter nav — all read from `lib/chapters.ts` and `useActiveChapter()`, so adding a chapter updates the navigation automatically.

**5 — Verify.** Run the checklist below. Then typecheck and lint.

## What's in `assets/`

Copy these in verbatim; they are the working implementations and already encode rules 2–6.

- **Engine** — `hooks/useSectionScroll.ts` (the primitive), `useReducedMotionPref.tsx`, `useLenis.ts`, `useIsMobile.ts`, `useActiveChapter.ts`, `useMouseParallax.ts`
- **Motion** — `components/motion/SectionTransition.tsx` (the portal dive), `Reveal.tsx`, `FadeIn.tsx`, `ScrollProgress.tsx`
- **Layout** — `components/layout/SectionShell.tsx`, `StoryExperience.tsx`, `GrainOverlay.tsx`
- **Wayfinding** — `components/navigation/ChapterProgress.tsx`
- **Shell + tokens** — `app/layout.tsx`, `app/providers.tsx`, `app/globals.css`
- **Templates to fill in** — `lib/chapters.ts`, `lib/motion.ts`

You still write per project: every `components/sections/*` chapter, `lib/content.ts`, `ChapterNav` (a shadcn Sheet over `NAV_CHAPTERS`), `ReduceMotionToggle` (a button on `useReducedMotionPref().toggle`), and any set-piece visuals. `lib/utils.ts` (`cn`) comes from `shadcn init`.

## Rig catalog

`references/rigs.md` has the full cookbook with code for each. In brief:

| Rig | Motion | Use for |
|---|---|---|
| **Portal dive** | scale → blur → opacity → translateZ | The default. Any statement chapter. Free via `SectionShell`. |
| **Letter portal** | Camera flies into a counter of the logo | The hero handoff into chapter one. |
| **Depth flight** | Beats stream past on `translateZ` over a starfield | A long narrative (an origin story) that would otherwise be a wall of text. |
| **Word illumination** | Body copy inks in word-by-word on scroll | A statement that must stay legible while it animates. |
| **Horizontal pan** | Pinned sideways travel; light shifts cool → warm | Two or more worlds/products contrasted. |
| **Odometer / countdown** | Digits roll as scroll scrubs | A number that means something (a date, a count). |
| **Iris wipe** | An aperture opens between two chapters | Bridging a hard light→dark seam. |
| **Spotlight + particles** | Cursor-tracked light over a dark canvas | Dark finale chapters (coming soon, contact). |

Compose, don't multiply: a chapter runs **one** rig. Two set-pieces fighting for the same scroll range reads as noise.

## Verification checklist

Before calling it done, confirm each of these by driving the actual page:

- [ ] Every chapter animates **backwards** cleanly when you scroll up.
- [ ] OS reduced-motion on → no pins, no scrubs, no infinite loops; all content is present, legible, and reachable.
- [ ] The in-app reduce-motion toggle does the same, and survives a reload.
- [ ] At 375px: no horizontal overflow, no 3D, no heavy blur, shorter runways.
- [ ] Text inside reveal/scrub components is exposed to screen readers (`aria-label` on the wrapper, `aria-hidden` on the animated tokens).
- [ ] Landmarks (`<nav>`, `<main>`, `<section aria-labelledby>`), sequential headings, a skip link, and visible focus rings.
- [ ] Particle/star positions are deterministic (seeded, not `Math.random()` at render) — otherwise SSR hydration mismatches.
- [ ] Typecheck (`npx tsc --noEmit`) and lint pass.

## Traps

- **A `filter` you stop passing does not reset.** When branching to a reduced path, pass `filter: "none"` explicitly; dropping the prop leaves the last blur stuck on the element.
- **Gradient text cannot be faded from a parent.** `background-clip: text` paints on the element that owns the background, so the opacity animation must live on that same element — not on an ancestor.
- **Hooks run unconditionally.** Compute all motion values, *then* select which style object to apply for reduced/mobile. Never early-return before a `useTransform`.
- **Lenis drives the native document scroll**, so `useScroll` reads it transparently — do not try to wire Lenis into Framer manually.
- **Runway length is the pacing dial.** If a chapter feels rushed, raise `trackVh`; if it drags, lower it. Do not fix pacing by changing easing.
