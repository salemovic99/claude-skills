# Architecture

The scaffold, the provider tree, and the token setup. Copy the files in `assets/` verbatim into the paths below — they are the working implementations.

## Stack

- **Next.js** (App Router, Turbopack) + **React 19** + **TypeScript strict**
- **Tailwind CSS v4** — CSS-first `@theme`, no `tailwind.config.js`
- **shadcn/ui** for every UI primitive (button, sheet, tooltip, badge…)
- **Framer Motion** for all animation — scroll-linked values, springs, reveals
- **Lenis** for inertial smooth-scroll
- **next/font** for the three faces

Deliberately absent: **no WebGL/Three.js, no GSAP/ScrollTrigger.** The 3D dive is CSS 3D transforms driven by Framer's scroll APIs. This holds 60fps, ships far less JS, and degrades on mobile by simply flattening a few style props. Reach for WebGL only if the design genuinely needs shaders or real geometry — and then it is a different skill.

```bash
npx create-next-app@latest frontend --typescript --tailwind --app --eslint
cd frontend
npm i framer-motion lenis lucide-react
npx shadcn@latest init
npx shadcn@latest add button sheet tooltip badge separator
```

If React 19 peer ranges bite, add `legacy-peer-deps=true` to `.npmrc`.

## File layout

```
app/
  layout.tsx        # Server: fonts, metadata, viewport, skip link, grain overlay, <Providers>
  page.tsx          # Server: renders <StoryExperience/> and nothing else
  providers.tsx     # Client: ReducedMotionProvider → MotionConfig + Lenis + TooltipProvider
  globals.css       # Tailwind v4 @theme tokens + brand utilities + reduced-motion floor
components/
  ui/               # shadcn/ui
  layout/           # StoryExperience, SectionShell, GrainOverlay, AmbientBackground
  navigation/       # ChapterNav (sheet), ChapterProgress (rail), ReduceMotionToggle
  sections/         # One file per chapter, in scroll order
  motion/           # SectionTransition, Reveal, FadeIn, Parallax, ScrollProgress
  visual/           # Set-piece visuals: particles, odometer, logo reveal, shapes
hooks/              # useReducedMotionPref, useIsMobile, useLenis,
                    #   useSectionScroll, useActiveChapter, useMouseParallax
lib/                # motion (easings/springs), chapters, content, utils (cn)
```

The split that matters: **`lib/` holds the story, `components/sections/` holds the staging.** Copy changes touch `lib/content.ts` only. Chapter order, labels, and tones live in `lib/chapters.ts` and drive the nav, the rail, and the ambient background — so adding a chapter is one array entry plus one component.

## The provider tree

```
<ReducedMotionProvider>          ← merges OS pref + persisted user toggle
  <ExperienceRuntime>            ← calls useLenis(); self-disables when reduced
    <MotionConfig reducedMotion={userReduced ? "always" : "user"}>
      <TooltipProvider>
        {children}
```

`reducedMotion="user"` already respects the OS setting. Flipping to `"always"` is what the in-app toggle does — it forces reduction even for visitors whose OS says nothing.

The toggle is stored in `localStorage` and read through `useSyncExternalStore`, not `useState` + `useEffect`. That matters: it hydrates without a setState-in-effect flash and stays in sync across tabs.

## Tokens (Tailwind v4)

All tokens live in `app/globals.css` under `@theme inline`, so every shadcn component inherits the brand for free. Two rules:

**Pin the color scheme.** A cinematic site is an art-directed fixed palette, not a themeable app. If the brand is light, neutralize the `dark:` variant so OS dark-mode cannot repaint shadcn internals:

```css
@custom-variant dark (&:is(.dark *));   /* class-scoped, never activated */
```

Then set `colorScheme: "light"` in the `viewport` export.

**Dark chapters are painted, not themed.** A chapter that goes near-black sets explicit colors on its own panel. It does not toggle a theme — that would repaint the fixed navigation too.

Beyond the shadcn semantic tokens, define:

- `--brand`, `--brand-soft`, `--brand-foreground` — the single accent
- `--font-sans` / `--font-serif` / `--font-mono`, wired to the `next/font` variables
- shadow ramp: `--shadow-soft`, `--shadow-glass`, `--shadow-lift`, `--shadow-glow`

And the utilities the rigs depend on (all in `assets/app/globals.css`):

| Utility | What it does |
|---|---|
| `glass` / `glass-dark` | Subtle backdrop-blur surface |
| `brand-gradient-text` | `background-clip: text` accent fill — **must sit on the element whose opacity animates** |
| `dot-grid` | Masked radial dot texture for the fixed background |
| `grain-layer` | Fixed film-grain plate (paired with `GrainOverlay`) |

## Motion language

One file, `lib/motion.ts`, owns the rhythm. Every component pulls easing, duration, and spring config from it — that shared timing is what makes the site feel like one object rather than eight animations.

- `EASE_LUX` — `[0.22, 1, 0.36, 1]`, the signature soft ease-out.
- `SPRING_SCROLL` — `{ stiffness: 90, damping: 30, mass: 0.4 }`, the camera smoothing.
- `SPRING_SOFT` — looser, for pointer parallax.
- `DURATION` — `fast / base / slow / glacial`. Cinematic means slow; `base` is 0.7s, not 0.2s.

## Performance contract

- `transform` / `opacity` / `filter` only.
- Blur is capped (≈14px) and gated off on mobile; `perspective` + `translateZ` are dropped there too.
- `will-change` is set per-branch on the element actually animating, never blanket.
- Particle and star fields use **deterministic** positions (index-seeded pseudo-random), so server and client render identically.
- Avoid `mix-blend-mode` on large scroll-animated layers — it forces expensive compositing and is a known Chromium scroll-jank source. (Two commits in the reference implementation exist purely to remove it.)

## Accessibility contract

- Landmarks: `<nav>`, `<main>`, `<section aria-labelledby>`; sequential headings; a skip link as the first focusable element.
- Split-text components (`Reveal`, word scrubs) put the full string in `aria-label` on the wrapper and mark the animated tokens `aria-hidden`.
- The chapter rail is real anchors (`<a href="#chapter">`) — Lenis intercepts them for a smooth glide, but they remain keyboard-navigable links with `aria-current` on the active one.
- Reduced motion is a first-class state, not a fallback: content is complete and static, never hidden because its reveal never fired.
