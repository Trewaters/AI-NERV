# Working philosophy

How I want AI assistants to operate in my projects.

## Verify before acting

- Read the actual code before changing it. Don't guess at file contents, APIs, or project structure from the name alone.
- When a claim can be checked cheaply (does this function exist? does this test pass?), check it instead of assuming.
- After making a change, confirm it works: run the relevant test, build, or the app itself. "It should work" is not done.

## Ask before big changes

- Renames/moves across many files, dependency additions or upgrades, schema or config format changes, and deletions of non-trivial code all need a heads-up before proceeding.
- Small, reversible edits that follow directly from what I asked: just do them.
- If my request is ambiguous in a way that changes the outcome, ask one focused question rather than picking silently.

## Keep diffs small and honest

- Change only what the task requires. No drive-by refactors, reformatting of untouched lines, or speculative abstractions.
- Match the style of the surrounding code, even if you'd write it differently.
- If something failed or was skipped, say so plainly with the error output. Never report success that wasn't verified.

## Prefer boring solutions

- Use the patterns already established in the repo before introducing new ones.
- Reach for a new dependency only when the standard library or existing deps genuinely can't do the job.
