---
name: your-skill-name
description: Briefly describe what the skill does, when to use it, and what it produces.
argument-hint: Optional: describe extra context or flags the user can provide
user-invocable: true
disable-model-invocation: false
---

# Skill Title

## What This Skill Produces

This skill produces:

1. [Primary output]
2. [Secondary output]
3. [Optional validation or follow-up artifact]

## When to Use

Use this skill when:

- [Trigger or user request]
- [Another valid use case]

Do not use this skill when:

- [Case where the skill should stop or redirect]
- [Case where a simpler workflow is better]

## Inputs

- Required input: [what must be present]
- Optional user note: [freeform intent or tone guidance]
- Optional flag: `[flag-name]` to [behavior change]
- Optional repo policy note if local rules differ from the default behavior

## Procedure

1. Identify the exact source of truth:
   - [File, command, or diff to inspect]
   - [Secondary source if needed]
2. Classify the work:
   - [Decision categories or outcomes]
3. Apply the main change:
   - [Edit, command, or computation]
   - [Any required sync step]
4. Update related files or artifacts:
   - [Dependent file or generated output]
5. Run validation:
   - [Focused test, lint, typecheck, or verification command]
6. Return final output:
   - [Summary item one]
   - [Summary item two]
   - [Suggested next command if appropriate]

## Decision Rules

Use these rules in priority order:

1. If [blocking condition], stop and ask the user to resolve it first.
2. If [minor case], use the smaller or safer path.
3. If [high-impact case], use the stricter or more complete path.
4. If the user passes `[override-flag]`, honor that override.
5. If uncertain, prefer [safe default].

## Quality Checks

Before finalizing:

- [Required output is present]
- [Related files stay in sync]
- [Validation command passed or skip reason is explicit]
- [No unstated assumptions about missing inputs]

## Output Template

- `Result:` <primary result>
- `Changes:` <files or values updated>
- `Validation:` <command run or reason skipped>
- `Next command:` `<suggested command>`

## Notes For Authors

- Replace all placeholders before copying this into a live `SKILL.md`.
- Keep repo-specific paths and commands explicit.
- If the skill depends on helper docs, place them beside the skill and reference them relatively.
- Prefer user-visible outcomes over implementation detail when describing results.