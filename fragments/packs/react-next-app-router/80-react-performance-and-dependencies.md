# React Performance And Dependencies

Use this fragment for frontend projects where bundle size, rendering cost, and dependency growth need active control.

## Performance defaults

- Measure before optimizing; do not add complexity without evidence.
- Paginate and order list queries instead of fetching unbounded collections.
- Select only the fields needed from the data layer.
- Avoid obvious N+1 query patterns when related data can be fetched together.
- Reserve layout space for images and async content to avoid layout shift.

## React and Next.js performance rules

- Memoize only when profiling or clear rerender costs justify it.
- Prefer dynamic loading for heavy, conditionally rendered UI when the stack supports it.
- Use the framework's optimized image component when available instead of raw image tags.
- Keep mobile interaction performance in mind, especially for loading states and touch targets.

## Dependency rules

- Check whether the stack already has a preferred library before adding a new one.
- Add a dependency only when it saves real complexity or risk.
- Prefer maintained packages with healthy release activity and TypeScript support.
- Verify vulnerability posture after adding dependencies.
- Distinguish runtime dependencies from dev-only tooling.
- Avoid duplicate libraries solving the same problem.

## Update discipline

- Update dependencies incrementally rather than in giant batches when possible.
- Re-run the relevant test and build checks after dependency updates.
- Treat dependency additions as long-term maintenance costs, not one-off conveniences.