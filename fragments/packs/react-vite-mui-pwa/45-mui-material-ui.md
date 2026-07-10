# MUI (Material UI) Rules

Use this fragment for repositories that use MUI (Material UI) as the component library, with Emotion as the styling engine.

## Stack assumptions

- `@mui/material` v6 or later with `@emotion/react` + `@emotion/styled`
- `@mui/icons-material` for icons
- Self-hosted fonts via `@fontsource/*` packages, not Google Fonts CDN links
- One MUI version across the repo; never mix major versions

If the target repo differs from these assumptions, trim this fragment before using it.

## Theming rules

- There is exactly one theme, created with `createTheme` in a dedicated theme module (commonly `src/theme.ts`), applied once at the app root with `ThemeProvider` and `CssBaseline`. Do not create ad hoc themes inside components.
- Support light and dark mode through the theme's `colorSchemes` with CSS variables enabled (`cssVariables: true`), not by swapping whole theme objects or hand-rolled context.
- Every color in component code comes from theme tokens (`palette.primary.main`, `palette.text.secondary`, ...). No hex, rgb, or named-color literals in components; if a color is missing, add it to the theme.
- Use `theme.spacing()` (or plain numbers in `sx`, which map to spacing units) for all margins, paddings, and gaps. No pixel literals for spacing.
- Use the theme's typography variants (`variant="h1"`..., `body1`, `caption`) instead of setting `fontSize`/`fontWeight` literals. If a needed text style repeats, define a typography variant in the theme.
- Global style changes belong in the theme's `components` key (`defaultProps`, `styleOverrides`), not in a global CSS file.

## Styling rules

- Use the `sx` prop for one-off styles and `styled()` for styles reused across components. Do not add plain `.css`/`.scss` files for component styling — the styling engine is Emotion, and mixing systems breaks theme tokens and dark mode.
- Make styles responsive with `sx` breakpoint objects (`sx={{ px: { xs: 2, md: 4 } }}`) or `theme.breakpoints`; never media-query pixel literals.
- Reference theme values inside `sx` via the callback form or token strings; never import the theme object directly into a component to read values.
- Do not use `!important` or fight MUI's specificity; use the documented slot/class override points (`slotProps`, `styleOverrides`, state classes like `.Mui-selected`).

## Component usage rules

- Prefer MUI components over raw HTML for anything interactive or themed (`Button`, `TextField`, `Dialog`, `Menu`, ...); MUI carries the keyboard and ARIA behavior you would otherwise have to rebuild.
- Preserve semantics with the `component` prop (`<Typography component="h2" variant="h5">`, `<Button component={Link}>`); the rendered element must match the document outline and router, not just the visual style.
- Use `Stack` for one-dimensional layout and `Grid` (the current size-prop API) for two-dimensional layout, before reaching for custom flexbox `Box`es.
- Use `slotProps` to customize component internals; do not use APIs the installed MUI version marks deprecated (`InputProps`, `componentsProps`, legacy `Grid` `item`/`xs` props).
- Every `IconButton` gets an `aria-label`. Icon-only controls without an accessible name are a defect, not a style choice.
- Forms: `TextField` is controlled, has a real `label` (placeholder is never the label), and surfaces validation through `error` + `helperText`.
- Dialogs use `DialogTitle`/`DialogContent`/`DialogActions` so labeling and focus containment work; opening state lives in the caller, and focus returns to the trigger on close (MUI handles this — do not disable it).

## Import and bundle rules

- Named imports from `@mui/material` are fine (`import { Button, Stack } from '@mui/material'`).
- Import icons one per path (`import DeleteIcon from '@mui/icons-material/Delete'`), never named imports from the `@mui/icons-material` barrel — the barrel drags thousands of modules into the dev server.
- Do not add a second component library, CSS framework, or utility-class system alongside MUI. If a component is missing, compose it from MUI primitives inside the repo.
