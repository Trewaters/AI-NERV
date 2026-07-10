---
name: frontend-ui-design
description: Design and build premium, immersive frontend UI — deliberate aesthetic direction, motion design, fluid typography, and performance guardrails. Use when the user asks for a "premium", "immersive", "polished", or "Awwwards-style" page or component, or asks to elevate the visual quality of existing UI. Not for routine CRUD screens or internal tooling where plain, fast UI is the right call.
argument-hint: "Optional: aesthetic direction (editorial, organic, cyber, cinematic), target page/component, or 'audit' to review existing UI"
---

# Frontend UI Design

Craft immersive, high-performance web UI with an intentional aesthetic
footprint — without violating this repo's accessibility and inclusion rules.
`.harness-core/references/A11Y.md` and the inclusion fragment always win over aesthetic
flair: motion is gated behind `prefers-reduced-motion`, contrast stays at
WCAG 2.2 AA, and every interaction works with keyboard and touch.

## What This Skill Produces

1. A committed aesthetic direction (named and justified in one or two lines).
2. Component/page code implementing that direction: entry sequence, hero,
   navigation, motion system, and typography scale.
3. Performance- and accessibility-safe animation code (composited properties
   only, reduced-motion and pointer-type guards in place).

## When to Use

Use this skill when:

- The user asks for a "premium", "immersive", "polished", or
  "Awwwards-style" landing page, hero, or component.
- The user asks to elevate or redesign existing UI's look and feel.
- The user passes `audit` — review existing UI against the checklists below
  and report, without changing code.

Do not use this skill when:

- The surface is an internal tool, admin screen, or form-heavy CRUD flow —
  plain, fast, accessible UI is the right call; skip the motion system.
- The user asked for a functional fix or feature with no visual-design intent.

## Inputs

- Required: the target page or component (or agreement to scaffold a new one).
- Optional: an aesthetic direction. If none is given, pick one that fits the
  product context and say which you chose:
  - **Editorial brutalism** — high-contrast monochrome, oversized type, sharp
    rectangular edges, raw grid structure.
  - **Organic fluidity** — soft gradients, deep rounding, glass surfaces,
    spring-based physics.
  - **Cyber / technical** — dark-mode dominant, glowing accents, monospaced
    type, rapid staggered reveals.
  - **Cinematic pacing** — full-viewport imagery, slow cross-fades, generous
    negative space, scroll-driven storytelling.
- Optional flag: `audit` — evaluate only, produce a findings report.

## Procedure

1. **Commit to a direction.** Never output generic, unopinionated UI. State
   the chosen aesthetic and let it drive every palette, radius, easing, and
   type decision. Verify the palette against WCAG 2.2 AA contrast (4.5:1
   body, 3:1 large text and UI) before writing components.
2. **Structure the experience:**
   - *Entry sequence*: no blank first paint. If assets (fonts, imagery, 3D)
     need resolving, add a lightweight preloader that exits fluidly (split
     reveal, scale-up, staggered text sweep). Skip it entirely when assets
     are light — a preloader that outlives its load is worse than none.
   - *Hero*: full-bleed (`100dvh` with `100vh` fallback), headline split by
     word or character for cascading entrances, subtle depth via floating
     elements or clip paths. Keep the split-text markup screen-reader safe
     (`aria-label` on the wrapper, `aria-hidden` on the fragments).
   - *Navigation*: sticky header that hides on scroll-down and reveals on
     scroll-up; rich hover previews where they earn their weight. Keyboard
     focus must reveal the header and reach everything hover can.
3. **Build the motion system:**
   - Scroll-driven narratives: pinned sections, horizontal journeys,
     parallax layers at varying scroll speeds.
   - Micro-interactions: magnetic buttons (pointer-distance pull), custom
     cursors with lerp smoothing, dimensional hover states via `transform`.
   - Every entrance animation staggers; nothing pops in all at once.
4. **Set the typography and texture:**
   - Extreme scale contrast: fluid headline sizes via `clamp()` (up to
     ~`12vw`), body copy at 16-18px minimum, in `rem`.
   - Variable or characterful fonts over system defaults, subset and
     self-hosted.
   - Atmospheric texture: noise overlays (`mix-blend-mode: overlay`, opacity
     0.02-0.05); frosted glass via `backdrop-filter: blur()` with thin
     semi-transparent borders.
5. **Enforce the performance guardrails** (non-negotiable):
   - Animate only `transform` and `opacity` — never `width`, `height`,
     `top`, or `margin`.
   - `will-change: transform` only while an element animates; remove after.
   - Wrap cursor logic and heavy hover effects in
     `@media (hover: hover) and (pointer: fine)`.
   - Wrap continuous or large-scale motion in
     `@media (prefers-reduced-motion: no-preference)`, with a static layout
     that still works when it doesn't apply.
6. **Validate** with the repo's gates (typecheck, lint, build) plus a visual
   pass at 320px width, keyboard-only navigation, and with reduced motion
   enabled in the OS/devtools.

## Library Choices

This repo's templates are React-based; reach for these first:

- **Framer Motion (`motion`)** — layout transitions, spring physics,
  staggered variants. It respects `prefers-reduced-motion` via
  `useReducedMotion`/`MotionConfig`; wire that in.
- **Lenis (`lenis`)** — smooth-scroll context. Disable it under reduced
  motion and never break native find-in-page, anchors, or keyboard scroll.
- **GSAP + ScrollTrigger** — timeline sequencing and scroll pinning when
  Framer Motion's scroll primitives run out.
- **React Three Fiber** — only if 3D/WebGL is explicitly requested; lazy-load
  it and provide a static fallback.

For vanilla/Electron surfaces without React, use GSAP, vanilla Lenis, and
SplitType for text chunking.

## Decision Rules

1. If aesthetics and accessibility conflict, accessibility wins — restyle
   until both hold (see `.harness-core/references/A11Y.md`, anti-patterns V1-V5, K1-K7).
2. If the surface is content- or task-critical (checkout, auth, settings),
   dial motion down to entrances and hover feedback only.
3. If a dependency isn't already in the repo, prefer CSS-only techniques
   before proposing to add it; name the tradeoff when you do propose it.
4. If the user gave no aesthetic direction, choose one and state it — don't
   ask, and don't average two directions into mush.
5. If `audit` was passed, report findings against the Procedure and Quality
   Checks sections; change nothing.

## Quality Checks

Before finalizing:

- Only `transform`/`opacity` are animated; no layout-thrashing properties.
- Reduced-motion, pointer-type, and 320px-reflow guards are present.
- Contrast, focus visibility, and keyboard paths meet `.harness-core/references/A11Y.md`.
- The chosen aesthetic is recognizable in the result — a reviewer could name
  it without being told.
- Repo quality gates (typecheck, lint, build) pass.

## Output Template

- `Direction:` <chosen aesthetic + one-line rationale>
- `Built:` <components/pages created or restyled>
- `Motion:` <animations added and their guards>
- `Validation:` <gates run + manual checks (320px, keyboard, reduced motion)>

## Attribution

Adapted from the `premium-frontend-ui` skill by Utkarsh Patrikar in GitHub's
**awesome-copilot** collection
(<https://github.com/github/awesome-copilot/blob/main/skills/premium-frontend-ui/SKILL.md>),
MIT License. Credit for the aesthetic directions, motion principles, and
performance guardrails goes to that project.

This skill is **not a direct copy** of the upstream file. It has been
restructured into this repo's skill format (procedure, decision rules,
quality checks, output template), subordinated to `.harness-core/references/A11Y.md`
and the inclusion fragment's accessibility requirements, and its library
guidance narrowed to this repo's React-based template stacks.
