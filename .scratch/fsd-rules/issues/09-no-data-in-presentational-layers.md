# 09: No data access in presentational layers

**What to build:** `shared/ui`, `entities/*/ui` and `entities/*/components` get data only through props. Lint (rule (f), at `error`) rejects imports of `@apollo/client`, stores, generated Apollo hooks, the Apollo client config, `shared/query` and `shared/api` there. Type-only imports stay allowed, and so do generated types. Generated hooks remain allowed in a feature's or page's `ui/`. The one existing offender, `AddToFavButton`, is suppressed with a named, reasoned disable that links a new architecture-debt note. Fixing it is a design change and out of scope.

See [spec](../spec.md): "ESLint configuration" rule (f), and "One-off fixes". Rule config and hit list: research 02 on branch `research/fsd-lint-tooling`.

**Blocked by:** 07 (Lint test harness and layer boundaries through boundaries).

**Status:** ready-for-agent

- [ ] `@typescript-eslint/no-restricted-imports` is a path-scoped override at `error`, with `allowTypeImports` on `@apollo/client`, `importNamePattern: '^use'` on the generated GraphQL module, and `shared/api` in the banned group. Its messages read "what is wrong → how to fix".
- [ ] The test covers:
  - a store import in `shared/ui`, which is flagged;
  - a generated hook in `entities/*/ui`, which is flagged;
  - a type-only `@apollo/client` import in `shared/ui`, which passes;
  - a generated hook in a feature's `ui/`, which passes.
- [ ] `AddToFavButton`'s component and its cache-update helper carry file-level disables. These name the rule and give a reason with a TODO linking a new `.scratch/architecture-debt/issues/NN-<slug>.md`. The note has `Status: needs-triage` and records the rule, the files, and why the fix is a design change.
- [ ] No other file-level disable is added.
- [ ] `npm run lint:ts` reports 0 problems, and `npm test` passes.
