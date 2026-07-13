# Rig cookbook

Every rig is the same primitive with different ranges:

```tsx
const ref = useRef<HTMLElement>(null);
const { smooth, reduced, isMobile } = useSectionScroll(ref);   // spring-smoothed 0→1
const someStyle = useTransform(smooth, [inputs…], [outputs…]);
```

The section is a **tall runway** (`height: 180vh`) containing a **sticky full-viewport panel** (`sticky top-0 h-screen`). Scroll travels the runway; the panel stays pinned; `smooth` goes 0→1 across it. Runway height is the pacing dial.

Every rig below ends with a `reduced` branch. That is not optional — see rule 3.

---

## 1. Portal dive — the default

The outgoing panel flies toward the camera (scale up, blur, fade) while the incoming one emerges from depth. Productized as `SectionTransition` and wrapped by `SectionShell`, so a statement chapter is *just markup*:

```tsx
export function Vision() {
  return (
    <SectionShell
      id="vision"
      labelledBy="vision-heading"
      trackVh={200}                    // longer runway = slower, heavier dive
      scaleRange={[0.9, 1, 1.18]}      // at [start, middle, end]
      blurRange={[8, 0, 0, 12]}        // at [0, .16, .84, 1]
      depth={200}                      // translateZ travel in px
    >
      <Reveal as="h2" text={VISION.statement} stagger={0.05} tokenClassName="brand-gradient-text" />
    </SectionShell>
  );
}
```

Tuning: `scale` end below ~1.15 reads as a zoom; above ~1.3 it reads as a *pass-through*. `depth` sells the 3D; it is dropped entirely on mobile.

Reach for a bespoke rig only when the chapter's meaning needs a specific gesture. Most chapters should be this.

---

## 2. Letter portal — hero → chapter one

The camera flies **into a counter of the wordmark** (the hole in a D, O, or A), which becomes the doorway to the next chapter. The trick: the next section shares the hero's exact background color, so the seam is invisible — you appear to travel *through the logo* into the site.

Recipe, on a `["start start", "end start"]` scroll offset:

1. Copy sub-groups (kicker, headline, subtitle) fade + rise + blur out early — `[0.08, 0.3]`.
2. The wordmark is **excluded** from that fade; it runs the portal.
3. The chosen letter scales hard (×20–40) with its counter aligned to viewport center; siblings streak outward.
4. An accent bloom flares at mid-dive `[0.3, 0.5, 0.62] → [0, 0.6, 0]`.
5. A whiteout (or blackout) overlay peaks and clears `[0.5, 0.6, 0.66, 0.93] → [0, 1, 1, 0]`, hiding the handoff.

Runway: ~280vh desktop / 220vh mobile. Reduced: a plain crossfade on a 100vh section, no pin.

---

## 3. Depth flight — a long story that must not be a wall of text

Narrative beats stream past the camera over a starfield. Each beat is positioned on `translateZ` and gets a depth blur as it approaches and passes:

```tsx
const z       = useTransform(smooth, [beatStart, beatEnd], [-1200, 400]);
const opacity = useTransform(smooth, [beatStart, beatStart + .1, beatEnd - .1, beatEnd], [0, 1, 1, 0]);
const blurPx  = useTransform(smooth, [beatStart, beatEnd], [12, 0]);
```

Give each beat a slice of the runway with generous overlap so one is always legible. Land the flight on something solid — a logo, a card row — so the chapter has a floor.

Reduced / mobile: render the beats as a static stacked column of paragraphs. The story survives; the flight doesn't.

---

## 4. Word illumination — legibility that still animates

The statement sits still and fully readable; as you scroll, each word inks from pale to full accent. Nothing moves, so nothing is unreadable — the right rig when the copy is the point.

```tsx
const BAND_START = 0.12, BAND_END = 0.86;   // lead-in, then hold

function Word({ p, index, total, word }) {
  const slice = (BAND_END - BAND_START) / total;
  const start = BAND_START + index * slice;
  const end   = start + slice * 1.8;        // overlap neighbours → smooth sweep, not a strobe
  const t = useTransform(p, [start, end], [0, 1]);
  const opacity = useTransform(t, [0, 1], [0.3, 1]);
  // The gradient lives on THIS span — a parent-level fill could not be faded per word.
  return <motion.span style={{ opacity }} className="inline-block brand-gradient-text">{word} </motion.span>;
}
```

Set a small accent set (`new Set(["considered", "feel", "name"])`) heavier as it lands. Add a thin rail at the bottom tracking `[BAND_START, BAND_END] → scaleX 0→1` so the reader knows how far the sweep has to go.

Reduced: render every word at full opacity, statically.

---

## 5. Horizontal camera pan — two worlds

Pin the section and translate a 200vw track sideways as scroll advances, shifting the light with it (cool → warm). Makes "two collections, one house" literal.

```tsx
const x        = useTransform(smooth, [0.1, 0.9], ["0vw", "-100vw"]);
const warmTint = useTransform(smooth, [0.3, 0.6], [0, 1]);   // crossfade a second gradient plate over the first
```

Two backdrop plates (cool base, warm overlay) plus two radial glows that hand off `[0.3, 0.55] → 0.9→0` / `[0.35, 0.62] → 0→1`. Optionally give each world a pointer-rotatable object driven by `useMotionValue` + `SPRING_SOFT` (desktop only — `!reduced && !isMobile`).

Reduced / mobile: stack the two worlds vertically. A horizontal pan on a phone is a swipe the user did not ask for.

---

## 6. Odometer / countdown scrub

Digits roll as the scroll scrubs — for a date, a launch counter, a quantity that carries meaning. Each digit column is a vertical strip of 0–9 translated by `-digit * 10%`; the value itself is a `useTransform` off `smooth`, so scrolling back rolls it back.

Keep the rolled digits `aria-hidden` and expose the final value in an `aria-label`. Reduced: render the number.

---

## 7. Iris wipe — bridging a hard seam

An interstitial between two chapters with clashing tones (a white overture into a black chapter). An aperture opens from the center — `clipPath: circle(${r}% at 50% 50%)` with `r` on `[0.2, 0.8] → [0, 150]` — revealing the next canvas, with kinetic type riding the opening.

Use this exactly where a crossfade would look like a mistake. One per site, at most.

---

## 8. Spotlight + particles — dark finale

Dark canvas, a cursor-tracked radial light, a drifting deterministic particle field, and magnetic rows (email, links) that lean toward the pointer.

```tsx
const { x, y } = useMouseParallax();     // already returns 0,0 when reduced or mobile
const light = useMotionTemplate`radial-gradient(600px circle at ${px}px ${py}px, rgba(255,255,255,0.06), transparent 70%)`;
```

Particles **must** be index-seeded, never `Math.random()` at render — otherwise SSR and client disagree and hydration blows up:

```tsx
const rand = (i: number, salt: number) => ((Math.sin(i * 127.1 + salt * 311.7) * 43758.5453) % 1 + 1) % 1;
```

Reduced: no cursor light, no drift; the copy and the links stand on the dark canvas as-is.

---

## Composing

- **One rig per chapter.** Two set-pieces sharing a scroll range read as noise.
- **Alternate tone.** light → dark → light → dark gives the journey a pulse. Set `tone` in `lib/chapters.ts` and let the ambient background follow it.
- **Alternate intensity.** A bespoke set-piece should be followed by a shell chapter. Back-to-back spectacle flattens into wallpaper.
- **Bridge, don't cut.** Where two chapters must butt against each other, either match their background colors exactly (invisible handoff) or spend an interstitial (iris wipe) on the transition.
