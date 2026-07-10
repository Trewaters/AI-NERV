# React / Next Full-Stack Baseline

Use this fragment for repositories built with Next.js App Router, React, and TypeScript.

## Stack assumptions

- Node.js 22.x
- TypeScript in `strict` mode
- ES modules
- npm as the package manager
- Next.js App Router, not Pages Router
- React with modern function components

If the target repo differs from these assumptions, trim this fragment before using it.

## TypeScript rules

- No `any` unless a short comment justifies the exception.
- Prefer `unknown` when the type is genuinely uncertain.
- Give all non-trivial exported functions explicit return types.
- Prefer `interface` for object shapes and `type` for unions or computed types.
- Do not relax compiler strictness to make code compile.

## React and Next.js rules

- Prefer App Router patterns only.
- Use Client Components by default when the feature is interactive; use Server Components only when there is a clear rendering or data-loading reason.
- Keep one component per file.
- Define a props interface above the component instead of typing props inline.
- Destructure props in the function signature.
- Use direct imports from source files, not barrel `index.ts` re-exports.
- Prefer the repo's existing UI primitives before introducing custom markup patterns.

## Project structure rules

- Keep feature code grouped by feature folder.
- Keep pure helpers in utility modules with no side effects.
- Keep operational scripts out of application runtime imports.
- Prefer path aliases for internal imports when the repo already defines them.

## Data and backend rules

- Use one runtime database access pattern consistently; do not mix parallel clients in app code without a strong reason.
- After schema changes, regenerate any generated client code before treating type errors as application bugs.
- Validate session or auth state before any authenticated operation.

## Code hygiene

- No commented-out code in committed changes.
- No magic numbers when a named constant would make behavior clearer.
- No new dependency unless the standard library or existing dependencies cannot reasonably solve the problem.
- Match the surrounding repo style before introducing a new pattern.