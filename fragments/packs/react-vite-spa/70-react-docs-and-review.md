# React Documentation And Review

Use this fragment when you want the agent to maintain documentation quality and perform stronger self-review.

## Documentation rules

- Document exported functions, exported types, and non-obvious component props when the repo expects API documentation or strong inline docs.
- Write comments for why, not what.
- Keep changelog entries user-facing rather than implementation-focused.
- Update setup or usage docs when a change affects how humans run, configure, or verify the project.

## Self-review rules

- Flag hardcoded role strings, secrets, and duplicated constants.
- Flag client code that treats a UI-side permission check as if it were real authorization.
- Flag new code that introduces `any`, barrel exports, or dead/commented-out code.
- Flag missing tests for new user-facing behavior.
- Prefer small, honest diffs over broad cleanup mixed with feature work.
