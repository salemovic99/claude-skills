# claude-skills

A collection of [Agent Skills](https://docs.claude.com/en/docs/claude-code/skills) for Claude Code. Each skill is a folder of instructions, reference docs, and copy-in code that teaches Claude how to do one thing well.

Claude loads a skill's `name` + `description` at startup and reads the rest **only when the request matches** — so installing a skill costs almost no context until it's actually needed.

## Skills

| Skill | What it does |
|---|---|
| [`scroll-story`](#scroll-story) | Builds scroll-driven cinematic narrative sites — pinned chapter runways, portal-dive transitions, scroll-scrubbed text — on Next.js + Framer Motion + Lenis. |

---

## Install

Clone the repo, then link or copy the skills you want into a skills directory.

```bash
git clone https://github.com/salemovic99/claude-skills.git
cd claude-skills
```

**Personal** — available in every project on your machine:

```bash
mkdir -p ~/.claude/skills
ln -s "$PWD/skills/scroll-story" ~/.claude/skills/scroll-story
```

**Project** — checked into a repo, shared with your team:

```bash
mkdir -p /path/to/project/.claude/skills
cp -r skills/scroll-story /path/to/project/.claude/skills/
```

Symlinking keeps the skill updated when you `git pull`; copying pins it. Either way, **restart Claude Code** so the new skill is discovered, then confirm with `/help` or by asking Claude what skills it has.

## Use

Skills fire on intent, not on a command. Just describe what you want:

> "Build me an immersive scrollytelling landing page for a coffee brand."

Claude matches that against the skill descriptions, loads `scroll-story`, and follows it. You can also force it explicitly:

> "Use the scroll-story skill to build the launch page."

If a skill isn't triggering, the fix is almost always the `description` in its `SKILL.md` frontmatter — it needs to name the words a user would actually say.

---

## `scroll-story`

Builds sites that read as **one continuous vertical journey** rather than a stack of sections. Each chapter is a tall scroll runway holding a sticky full-viewport panel; scroll progress drives a spring-smoothed "camera" that flies through one panel into the next.

The whole engine is one primitive — map a section's `useScroll` progress onto composited transforms — and every set-piece is that primitive with different ranges.

**Stack:** Next.js (App Router) · React 19 · TypeScript · Tailwind v4 · shadcn/ui · Framer Motion · Lenis. No WebGL, no GSAP: the 3D dive is CSS 3D transforms, which holds 60fps and degrades on mobile by flattening a few style props.

### Use it for

Cinematic and immersive landing pages, brand journey sites, scrollytelling, pinned scroll sections, scroll-linked animation.

### Don't use it for

Dashboards, admin panels, apps, docs — anything content-dense where users scan rather than travel. Pinned runways multiply scroll distance, which is a feature for a story and a defect for a product.

### What you'll be asked for

The skill is brand-agnostic; the story *is* the design, so it needs inputs before it can build:

- **Chapters** — an ordered list, each with a label, the one question it answers, and a light/dark tone. Six to eight is the working range.
- **Palette** — background, foreground, and one accent used sparingly. Cinematic sites are near-monochrome with one voice.
- **Type** — a display face, a body sans, a mono for eyebrows and chapter numbers. Three, no more.
- **A signature moment per chapter** — the one thing the visitor remembers, picked from the rig catalog.

If you don't supply these, Claude will propose a set and confirm them with you before scaffolding.

### Rig catalog

A "rig" is a chapter's motion set-piece. One rig per chapter — two fighting for the same scroll range reads as noise.

| Rig | Motion | Use for |
|---|---|---|
| **Portal dive** | scale → blur → opacity → translateZ | The default. Any statement chapter. |
| **Letter portal** | Camera flies into a counter of the logo | The hero handoff into chapter one. |
| **Depth flight** | Beats stream past on `translateZ` over a starfield | A long narrative that would otherwise be a wall of text. |
| **Word illumination** | Body copy inks in word-by-word on scroll | A statement that must stay legible while it animates. |
| **Horizontal pan** | Pinned sideways travel; light shifts cool → warm | Two or more worlds contrasted. |
| **Odometer / countdown** | Digits roll as scroll scrubs | A number that means something. |
| **Iris wipe** | An aperture opens between two chapters | Bridging a hard light→dark seam. |
| **Spotlight + particles** | Cursor-tracked light over a dark canvas | Dark finale chapters. |

### Files

```
skills/scroll-story/
  SKILL.md                    # The six rules, build sequence, verification checklist, traps
  references/
    architecture.md           # File layout, provider tree, Tailwind v4 tokens, perf + a11y contracts
    rigs.md                   # Full cookbook — code for each of the eight rigs
  assets/                     # Working implementations, copied in verbatim
    hooks/                    # useSectionScroll (the primitive), useLenis, useIsMobile,
                              #   useReducedMotionPref, useActiveChapter, useMouseParallax
    components/motion/        # SectionTransition (portal dive), Reveal, FadeIn, ScrollProgress
    components/layout/        # StoryExperience, SectionShell, GrainOverlay
    components/navigation/    # ChapterProgress
    app/                      # layout.tsx, providers.tsx, globals.css
    lib/                      # chapters.ts, motion.ts (templates to fill in)
```

Everything in `assets/` is production code, not a sketch — it already encodes the accessibility, mobile, and performance rules, so it gets copied in rather than rewritten.

### What it guarantees

Every build off this skill ships with reduced-motion support at three layers (OS preference, a persisted in-app toggle, and a static branch inside every rig), a mobile path that drops 3D and blur, reversible scroll (scroll up and every animation runs backwards to its exact start state), and screen-reader-legible text inside animated components. There's a verification checklist in `SKILL.md` that Claude runs before calling the job done.

---

## Add a skill

One folder per skill under `skills/`, with a `SKILL.md` at its root:

```
skills/my-skill/
  SKILL.md          # required
  references/       # optional — deep docs Claude reads on demand
  assets/           # optional — code, templates, files to copy into projects
  scripts/          # optional — executable helpers
```

`SKILL.md` needs YAML frontmatter with exactly two fields:

```markdown
---
name: my-skill
description: What it does, and — critically — when to use it. Name the words a user would actually say.
---

# My Skill

Instructions for Claude...
```

Two rules worth internalizing:

1. **The `description` is the trigger.** It's the only part Claude sees before deciding to load the skill. Write it for matching, not for marketing: list the phrasings, synonyms, and task shapes that should fire it.
2. **Keep `SKILL.md` lean and push depth into `references/`.** `SKILL.md` is loaded whole; reference files are read only when Claude needs them. Cookbooks, long code, and edge-case tables belong in `references/`.

## License

MIT
