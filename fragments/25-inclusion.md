# Inclusion and accessibility

Operational rules for all generated code, copy, tests, and docs. The full
rationale, references, and review checklist live in `.harness-core/references/INCLUSION.md`
— consult it when a decision here feels ambiguous. (That document is adapted
from, not copied from, <https://github.com/BranonConor/inclusion.md>.)

## No default user

- Don't design or write for a single "average user". That silently assumes a
  non-disabled, English-fluent, neurotypical user on a fast connection and a
  modern device. Support varied cognition, language, sensory and motor
  abilities, assistive technology, and network/device conditions.

## Inclusive language

Applies to code identifiers, comments, docs, UI copy, and commit messages:

- quick check / smoke test, not "sanity check"
- placeholder / sample value, not "dummy"
- blocklist / allowlist, not "blacklist / whitelist"
- primary / replica or leader / follower, not "master / slave"
- surprising / unexpected, not "crazy / insane"
- legacy clause / carve-out, not "grandfather clause"
- folks / everyone / team, not "guys"
- "wheelchair user", "has <condition>" — never "wheelchair-bound" or
  "suffers from"
- Default to identity-first language ("disabled person", "Deaf person");
  avoid euphemisms like "differently abled" or "special needs".
- Represent disabled people with agency — as experts and decision-makers, not
  edge cases, inspirations, or beneficiaries.

## UI copy and flows

- Plain language by default: US grade 7-8 reading level; grade 6 for critical
  flows (sign-up, payment, consent).
- Progressive disclosure: summary first, detail on demand.
- Mark required vs. optional actions explicitly; make errors clear and
  recoverable.
- No forced timers without an extend/disable option; no surprise modals,
  redirects, or auto-playing media/motion.
- Redundant cues: icon + label, not icon alone; never color, motion, or
  position as the only carrier of meaning.

## Accessible code baseline

The full anti-pattern catalog with severities, WCAG references, and fixes
lives in `.harness-core/references/A11Y.md` — use it when reviewing or auditing
UI code.

- Semantic HTML (`<button>`, `<nav>`, `<label>`, landmarks, ordered headings);
  keyboard support and visible focus for every interactive element; correct
  roles/names/states for screen readers.
- WCAG 2.2 contrast (4.5:1 body text, 3:1 large text and UI); text resize to
  200% without breakage; touch targets ≥ 24x24 CSS px (44x44 preferred).
- Respect `prefers-reduced-motion`, `prefers-color-scheme`,
  `prefers-reduced-transparency`, `forced-colors`.
- Never hardcode user-facing strings, dates, numbers, or currencies; support
  RTL, variable text length, and full Unicode in names.
- Minimize memory load and forced precision; chunk long workflows; preserve
  state (autosave, drafts, undo); confirm destructive actions.
- Handle slow networks, offline, and low-end devices.

## Self-review before finishing

Before presenting generated output, check: who does this exclude? Does it work
with assistive tech, on a slow connection, in another language? Does the
language carry ableist metaphors or deficit framing? If unsure, run the review
prompts in `.harness-core/references/INCLUSION.md` §9.
