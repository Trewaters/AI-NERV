# INCLUSION.md

> A repository-level context engineering document that gives AI coding
> assistants inclusion-oriented guidance during software generation workflows.

`INCLUSION.md` is the inclusion-oriented sibling of `A11Y.md`, `CONTRIBUTING.md`,
and `design.md`. Where `A11Y.md` operationalizes technical accessibility
compliance, `INCLUSION.md` operationalizes the contextual, representational, and
sociotechnical considerations that AI-assisted development tends to flatten.

This file is intended to be read by **both humans and AI coding assistants**
(Copilot, Cursor, Claude Code, Windsurf, Continue, etc.) as part of repository
context. It is a living document. Edit it. Argue with it. Localize it.

---

## 0. How To Use This File

1. Copy `INCLUSION.md` into the root of your repository alongside `README.md`,
   `CONTRIBUTING.md`, and `A11Y.md` (if you have one).
2. Adapt the **Project Context** section to your repository, product, and
   audience. Generic guidance is a starting point - specificity is where this
   file earns its keep.
3. Reference it explicitly from your AI assistant configuration. For example:
   - GitHub Copilot: add a `.github/copilot-instructions.md` that says
     `Follow the inclusion guidance in /INCLUSION.md.`
   - Cursor: reference it in `.cursor/rules` or `.cursorrules`.
   - Claude Code: reference it from `CLAUDE.md`.
   - Continue / Windsurf / etc.: include it as a workspace context file.
4. Review and update this file the same way you review and update your
   design system, your accessibility audit, and your dependency manifest.
   Inclusion is not a one-time configuration.

> **Important limitation.** This file does not eliminate model bias.
> Bias mitigation is an unresolved sociotechnical problem and you cannot prompt
> your way out of it. Inclusion still requires participatory research, disabled
> practitioners, accessibility expertise, diverse teams, human review, and
> structural accountability. `INCLUSION.md` is an operational layer, not a
> substitute.

> **How this repo wires it in.** In `ai-harness-core`, the operational rules
> from this document are distilled into
> [`fragments/25-inclusion.md`](../fragments/25-inclusion.md), which the build
> script concatenates into the generated `CLAUDE.md`, `AGENTS.md`, and
> `.github/copilot-instructions.md` of every consuming repo. This file is the
> full reference; the fragment is what agents read on every task.

---

## 1. Project Context

- **Product:** Shared AI-assistant configuration - instruction fragments,
  skills, and hooks that project templates vendor as a git subtree at
  `.harness-core/` and compile into `CLAUDE.md`, `AGENTS.md`, and
  `.github/copilot-instructions.md`.
- **Primary users:** AI coding assistants (Claude Code, GitHub Copilot, etc.)
  reading the generated instruction files, and the maintainer's template repos
  (`template-react-vite`, `template-electron`, ...). Downstream, the end users
  of every app built from those templates.
- **Known underserved users:** End users of downstream apps who rely on
  assistive technology, plain language, or non-English locales. Existing
  fragments focus on code quality and security; inclusion guidance was absent
  until this file.
- **Distribution context:** Guidance propagates into React / Next.js / Vite /
  Electron apps that may run on any device, network condition, language, and
  assistive technology.
- **Stakes:** Defaults set here multiply. An exclusionary pattern baked into a
  shared fragment ships in every generated instruction file and, from there,
  into every app the templates produce.

Generated code, copy, and interaction patterns should be evaluated against the
context above before being merged.

---

## 2. Core Principle

> **Do not optimize for a single "default user."**

Inclusive systems support diverse:

- cognitive models and processing speeds
- communication styles and language patterns
- sensory experiences
- motor capabilities
- cultural contexts and lived experiences
- literacy levels and reading comprehension
- assistive technologies
- network, device, and battery conditions

When generated output assumes "the average user," it is almost always assuming a
non-disabled, English-fluent, neurotypical user with a fast connection, a
modern device, and full sensory and motor capability. That user is a
statistical artifact, not a person.

**Reference:** Kat Holmes, _Mismatch: How Inclusion Shapes Design_,
<https://mitpress.mit.edu/9780262539485/mismatch/>

---

## 3. Known Training Data Risks

Large language models are trained largely on public web data, open-source code,
and curated text corpora. Empirical research has documented systemic biases
inherited from this distribution. Generated output may reflect:

- **Inaccessible implementation patterns.** The public web fails WCAG at
  enormous scale; models trained on it inherit those failures. See WebAIM
  Million.
- **Western, English-centric assumptions.** Date formats, name structures,
  address formats, currency, units, reading direction, color symbolism.
- **Ableist language patterns.** "Sanity check," "crippled," "blind to,"
  "tone-deaf," "lame," "dummy variable," "crazy," "insane."
- **Neurotypical communication defaults.** Implicit assumptions about
  conciseness, eye contact, linear narrative, "professional tone."
- **Underrepresentation of disability communities.** Disabled users framed as
  edge cases rather than first-class users.
- **Exclusionary UX conventions.** Hover-only interactions, tiny touch targets,
  color-only state, time-limited flows, motion without preference checks.
- **Deficit framing.** Disability described as something to overcome,
  inspirational, or tragic rather than as part of human variation.
- **Intersectional erasure.** Disabled people who are also Black, Indigenous,
  trans, women, non-Western, or non-English-speaking are particularly
  underrepresented in training data.

**Research references:**

- WebAIM Million Report - <https://webaim.org/projects/million/>
- _Centering the Margins: Outcomes that Disabled Users Care About_ -
  <https://dl.acm.org/doi/10.1145/3613904.3642233>
- _ABLEIST: Measuring Ableist Harms in LLMs_ -
  <https://arxiv.org/abs/2510.10998>
- Brookings, _How AI can better serve people with disabilities_ -
  <https://www.brookings.edu/articles/how-ai-can-better-serve-people-with-disabilities/>
- Janelle Shane, _You Look Like a Thing and I Love You_ -
  <https://www.hachettebookgroup.com/titles/janelle-shane/you-look-like-a-thing-and-i-love-you/9780316525206/>

---

## 4. Communication Diversity Guidance

When generating UI copy, error messages, onboarding flows, documentation,
notifications, or chat-style interactions, **do not assume**:

- linear thinking
- concise communication
- neurotypical conversational structure
- high reading comprehension
- rapid processing speed
- conventional language patterns
- English fluency
- access to context the user is presumed to "already know"

Instead, **support**:

- progressive disclosure (summary first, detail on demand)
- multimodal communication (text + visual + audio where appropriate)
- flexible interaction pacing (no forced timers without an opt-out)
- non-linear workflows (let users return, restart, branch, undo)
- redundant comprehension cues (icon + label + tooltip, not icon alone)
- user-controlled complexity (an "advanced mode" toggle is fine; defaulting
  every user to it is not)
- plain language by default; reserve jargon for opt-in technical surfaces
- explicit indication of required vs. optional actions
- clear, recoverable error states

**Suggested reading levels:**

- General consumer copy: target US grade 7-8 reading level.
- Critical flows (sign-up, payment, consent, healthcare, civic services):
  target US grade 6 reading level.
- Plain language is a hard skill. It is not "dumbing down." See
  <https://www.plainlanguage.gov/>.

---

## 5. Disability Representation Guidance

When generating product copy, marketing, imagery prompts, persona
descriptions, user research artifacts, documentation examples, or fictional
user names and avatars:

**Avoid:**

- inspiration-porn framing ("despite their disability...")
- deficit-based language ("suffers from," "afflicted with," "wheelchair-bound")
- infantilization of disabled adults
- framing accessibility as charity, generosity, or a "nice to have"
- "overcoming disability" narratives
- tokenized representation (one disabled persona to "cover" inclusion)
- assuming disability is rare, temporary, or visible
- assuming disability is incompatible with expertise, leadership, or technical
  fluency

**Prefer:**

- agency-centered language ("a wheelchair user," "a blind developer,"
  "someone who uses a screen reader")
- adaptive interaction support over special-case carve-outs
- disabled users as domain experts, decision-makers, and engineers
- contextual flexibility (situational, temporary, and permanent disability all
  benefit from the same design choices)
- representation across intersections (disability + race, gender, age, class,
  language)

**Language guidance:**

- Identity-first vs. person-first language varies by community. Default to
  identity-first ("disabled person," "Autistic person," "Deaf person") unless
  the specific community or individual prefers otherwise. When in doubt, ask.
- Avoid euphemisms like "differently abled," "special needs," or "handicapable"
  unless a community has explicitly reclaimed them.
- Do not use "diverse" as a synonym for "non-white" or "non-male" or
  "non-disabled." A single person is not "diverse."

**References:**

- Disability Visibility Project - <https://disabilityvisibilityproject.com/>
- National Center on Disability and Journalism style guide -
  <https://ncdj.org/style-guide/>
- ADA National Network, _Guidelines for Writing About People With
  Disabilities_ - <https://adata.org/factsheet/ADANN-writing>

---

## 6. Cognitive Accessibility Considerations

Cognitive accessibility is structurally underrepresented in WCAG, in
accessibility tooling, and in training data. Treat it as a first-class concern.

Generated experiences should:

- minimize unnecessary memory load (don't ask users to remember information
  across screens)
- minimize unnecessary precision (allow approximate input where possible -
  "around $50/mo" is often more useful than forcing exact decimals)
- chunk long workflows into clearly labeled steps
- preserve user state aggressively (autosave, restorable drafts, recoverable
  errors)
- avoid time pressure unless safety-critical
- avoid surprise modals, surprise redirects, and unexpected context shifts
- avoid auto-playing media, motion, sound, or animation by default
- respect `prefers-reduced-motion`, `prefers-reduced-transparency`, and
  `prefers-color-scheme`
- favor explicit confirmations for destructive or irreversible actions
- support undo wherever feasible
- avoid using color, motion, or position as the sole carrier of meaning

**Reference:**

- W3C Cognitive Accessibility Guidance - <https://www.w3.org/WAI/cognitive/>
- COGA Task Force - <https://www.w3.org/WAI/GL/task-forces/coga/>

---

## 7. Inclusive Language Heuristics

When generating any natural-language output, prefer the following:

| Avoid                        | Prefer                                        |
| ---------------------------- | --------------------------------------------- |
| sanity check                 | quick check, smoke test, gut check            |
| dummy value / dummy variable | placeholder, sample value                     |
| blacklist / whitelist        | blocklist / allowlist, denylist / allowlist   |
| master / slave               | primary / replica, leader / follower          |
| crazy, insane, nuts, mental  | surprising, unexpected, wild, intense         |
| tone-deaf, blind to          | unaware of, dismissive of, missing context on |
| crippled, lame               | broken, limited, degraded                     |
| guys (addressing a group)    | folks, everyone, team, y'all, all             |
| mankind / manpower           | humanity / staffing                           |
| grandfather clause           | legacy clause, exception, carve-out           |
| normal user                  | typical user, default user, baseline user     |
| handicapped                  | disabled                                      |
| suffers from <condition>     | has <condition>, lives with <condition>       |
| wheelchair-bound             | wheelchair user                               |
| the disabled / the blind     | disabled people / blind people                |

This list is not exhaustive. Repositories should extend it with
domain-specific guidance.

**References:**

- Conscious Style Guide - <https://consciousstyleguide.com/>
- Inclusive Naming Initiative - <https://inclusivenaming.org/>
- Google Developer Documentation Style Guide -
  <https://developers.google.com/style/inclusive-documentation>
- Microsoft Writing Style Guide, Bias-free communication -
  <https://learn.microsoft.com/style-guide/bias-free-communication>

---

## 8. Engineering Guidance

Generated code should:

- preserve semantic HTML structure (`<button>`, `<nav>`, `<main>`, `<label>`,
  landmarks, headings in order)
- support keyboard interaction for every interactive element
- support screen readers (correct roles, names, states, live regions where
  appropriate)
- avoid inaccessible interaction traps (custom dropdowns without focus
  management, divs with `onClick` and no role/keyboard handling)
- maintain visible focus indicators that meet WCAG 2.4.11 contrast
- meet WCAG 2.2 color contrast: 4.5:1 body text, 3:1 large text and UI
- support text resize up to 200% without loss of content or functionality
- support `prefers-reduced-motion`, `prefers-color-scheme`,
  `prefers-reduced-transparency`, `forced-colors`
- support touch targets of at least 24x24 CSS pixels (WCAG 2.2 minimum); 44x44
  is strongly recommended
- avoid time-limited interactions without an explicit extend/disable option
- preserve user agency: support undo, cancel, back, save-as-draft
- localize: never hardcode user-facing strings, dates, numbers, currencies,
  or units
- internationalize: support RTL layouts, variable text length, non-Latin
  scripts, full Unicode in names
- avoid PII leakage in logs, error messages, telemetry, and AI tool context
- handle slow networks, offline, and low-end devices

Accessibility compliance alone is not sufficient for inclusion, but it is a
hard prerequisite. A product cannot be inclusive while being inaccessible.

**References:**

- WCAG 2.2 - <https://www.w3.org/TR/WCAG22/>
- ARIA Authoring Practices Guide - <https://www.w3.org/WAI/ARIA/apg/>
- Inclusive Design Principles - <https://inclusivedesignprinciples.org/>
- Inclusive Components by Heydon Pickering - <https://inclusive-components.design/>
- WebAIM - <https://webaim.org/>
- a11ysupport.io - <https://a11ysupport.io/>

---

## 9. AI Generation Review Prompts

Before merging AI-generated output - whether code, copy, design, tests, or
documentation - evaluate it against the following prompts. These are intended
to be used by humans, by reviewers, and by AI assistants themselves when asked
to self-review.

1. Does this output assume a single "default user"? Who is that user, and who
   does that assumption exclude?
2. Could this interaction exclude users with cognitive, communication, or
   processing differences?
3. Does this require unnecessary precision, memory load, or speed?
4. Are disabled users represented with agency and autonomy, or as
   beneficiaries / inspirations / edge cases?
5. Would this interaction work across multiple sensory modalities (sight,
   hearing, touch, voice)?
6. Does generated language reinforce stereotypes, deficit framing, or ableist
   metaphors?
7. Are alternative workflows available for users who cannot complete the
   "happy path"?
8. Is complexity user-controlled, or system-imposed?
9. Could this design exclude users outside dominant cultural, linguistic, or
   regional assumptions?
10. Does this work with assistive technology - screen readers, switch access,
    voice control, magnification, eye tracking?
11. Does this work on a slow network, on a low-end device, in a non-English
    language, in a right-to-left script?
12. Does this respect user consent, privacy, and the right to opt out of
    surveillance and personalization?
13. Whose lived experience would catch the failure mode I cannot see?
14. If this were the only software a user could access to do this task, would
    that be acceptable?

If you cannot answer these questions, that is the signal to bring in research,
disabled practitioners, and accessibility expertise before shipping - not
after.

---

## 10. Domain-Specific Extensions

The default `INCLUSION.md` is generic. Real inclusion guidance is contextual.
Extend this document with sections specific to your domain. Examples:

- **Healthcare:** PHI handling, plain-language consent, symptom-checker
  framing, mental-health crisis pathways, refusal-of-care safeguards.
- **Financial services:** plain-language fee disclosure, unbanked / cash-only
  users, predatory dark patterns to avoid, accessibility of debt and credit
  flows.
- **Civic / government:** literacy, language access, identity documentation
  assumptions, immigrants and undocumented users, accessibility of legal
  remedies.
- **Education:** age-appropriate language, neurodivergent learners, varied
  literacy levels, shared-device contexts, low-bandwidth learners.
- **Hiring / HR:** name pronunciation and rendering, gender beyond binary,
  disability disclosure, criminal-record questions, accessibility of
  application flows.
- **Creative / generative tools:** representation in default outputs, opt-in
  vs. opt-out personalization, consent for likeness and voice, watermarking.

Add the section your repository actually needs. In this repo, domain-specific
extensions belong in a consuming repo's `ai/fragments/`, next to its other
stack-specific guidance.

---

## 11. What This File Does Not Do

`INCLUSION.md` is **not**:

- a substitute for participatory research with disabled users
- a substitute for hiring disabled designers, engineers, and researchers
- a substitute for accessibility audits and remediation
- a substitute for legal and regulatory compliance (ADA, EAA, AODA, Section
  508, EN 301 549, etc.)
- a guarantee that an AI assistant will follow its guidance
- a one-time deliverable

It is an operational scaffold. It lowers the floor. It does not raise the
ceiling. The ceiling is raised by people - especially disabled people - with
authority, budget, and time.

---

## 12. Maintenance

- **Owner:** Tre' Grisby (repository owner).
- **Review cadence:** Quarterly, alongside the other shared fragments.
- **Change log:** Track meaningful changes through this repository's commit
  history and releases.
- **Feedback:** Open an issue on this repository
  (<https://github.com/Trewaters/ai-harness-core>) to flag exclusionary
  patterns, language, or assumptions in this file or in the guidance it
  generates.

---

## 13. Attribution & License

This document is adapted from the `INCLUSION.md` template by Branon Conor,
published at <https://github.com/BranonConor/inclusion.md> under the MIT
License and originating from his essay _The need for INCLUSION.md_
(<https://branon.dev/blog/posts/the-need-for-inclusion-md>). Credit for the
concept and the original template goes to that project.

This version is **not a direct copy** of the upstream template. It has been
restructured and rewritten for `ai-harness-core` — project context, the
distillation into `fragments/25-inclusion.md`, and maintenance details are
specific to this repository. For the canonical, general-purpose template,
use the upstream repo.

You are encouraged to adapt, fork, translate, and improve this file in turn.
Attribution is appreciated but not required.
