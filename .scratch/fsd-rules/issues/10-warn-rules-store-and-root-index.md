# 10: Warn rules for whole-store subscriptions and root index exports

**What to build:** Two rules at `warn` go live. lint-staged's `--max-warnings=0` turns them into a block for any file a commit touches, so existing violations get fixed boy-scout.
- (g) A `use…Store()` call with no selector is flagged, globally.
- A slice root `index.ts` that re-exports from anything other than `./ui` is flagged. `export { X } from './ui/X'` counts as from `./ui` and passes (a spec decision).

ESLint overrides replace a rule's options instead of merging them, so every override that sets `no-restricted-syntax` repeats the (g) selector. The test proves it. The 16 existing whole-store subscriptions and the 9 existing root-index hits are **not** fixed here.

See [spec](../spec.md): "ESLint configuration" rules (g) and root index, and the decision on the open question. Selectors: research 02 on branch `research/fsd-lint-tooling`.

**Blocked by:** 08 (Segment structure rules). That ticket adds the `no-restricted-syntax` overrides that must repeat (g).

**Status:** ready-for-agent

- [ ] (g) is a global `no-restricted-syntax` selector at `warn`, and it is repeated in every `no-restricted-syntax` override.
- [ ] The root-index rule is a path-scoped override at `warn`.
- [ ] Both messages read "what is wrong → how to fix".
- [ ] The test covers:
  - `useXStore()`, which warns;
  - `useXStore((s) => s.x)`, which passes;
  - `useXStore()` inside a file covered by another `no-restricted-syntax` override, which still warns;
  - `export *` from `./model` in a root `index.ts`, which warns;
  - `export { X } from './ui'` and `export { X } from './ui/X'`, which pass.
- [ ] The test asserts severity (`warn` vs `error`) for these rules.
- [ ] `npm run lint:ts` reports 0 errors. The known warnings are expected, because `lint:ts` does not use `--max-warnings=0`.
- [ ] `npm test` passes.
