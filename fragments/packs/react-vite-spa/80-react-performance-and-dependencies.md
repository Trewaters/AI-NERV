# React SPA Performance And Dependencies

Use this fragment for client-rendered frontend projects where bundle size, rendering cost, and dependency growth need active control.

## Performance defaults

- Measure before optimizing; do not add complexity without evidence.
- Paginate and order list requests instead of fetching unbounded collections.
- Request only the fields the feature needs when the API supports it.
- Reserve layout space for images and async content to avoid layout shift.
- Set explicit dimensions and lazy loading on images; there is no framework image component doing this for you.

## React and bundle performance rules

- Memoize only when profiling or clear rerender costs justify it.
- Split route-level and heavy conditional UI with dynamic `import()` and `React.lazy`.
- Watch the production build output; investigate when a change meaningfully grows the main bundle.
- Keep mobile interaction performance in mind, especially for loading states and touch targets.

## Dependency rules

- Check whether the stack already has a preferred library before adding a new one.
- Add a dependency only when it saves real complexity or risk.
- Prefer maintained packages with healthy release activity and TypeScript support.
- Prefer tree-shakeable ESM packages; a small utility is not worth a large non-shakeable import.
- Verify vulnerability posture after adding dependencies.
- Distinguish runtime dependencies from dev-only tooling.
- Avoid duplicate libraries solving the same problem.

## Update discipline

- Update dependencies incrementally rather than in giant batches when possible.
- Re-run the relevant test and build checks after dependency updates.
- Treat dependency additions as long-term maintenance costs, not one-off conveniences.
