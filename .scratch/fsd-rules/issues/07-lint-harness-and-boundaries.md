# 07: Lint test harness and layer boundaries through boundaries

**What to build:** A config edit can no longer silently weaken the architecture rules. One vitest file drives the real ESLint config through the ESLint Node API against on-disk fixtures that mirror `src/`'s layer layout, and asserts which rule ids fire. The first rules it covers replace the unmaintained FSD `layers-slices` preset with `eslint-plugin-boundaries` configured directly: layer order, no imports between slices on the same layer (every layer), imports into another slice only through its root `index.ts`, and `@x/*.ts` cross-imports allowed on entities only. The 3 existing deep imports are fixed, and the Navbar → AuthModal suppression gets a reason that links the first architecture-debt note. `npm run lint:ts` finally lints `.tsx` files.

See [spec](../spec.md): "ESLint configuration", "Scripts and hooks", "One-off fixes", "Testing Decisions". Boundaries config and hit list: research 02 on branch `research/fsd-lint-tooling`.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] The `layers-slices` extend is gone; the `import-order` extend stays.
- [x] `eslint-plugin-boundaries` is a direct devDependency pinned at exactly `4.2.2`.
- [x] `boundaries/element-types` and `boundaries/entry-point` are at `error`, with messages in the form "what is wrong → how to fix".
- [x] The test has a violating and an allowed fixture for: an upward import (a), a same-layer slice import (b), a deep import vs a root import (c), and `@x/*.ts` allowed on entities but rejected on features.
- [x] The test runs in the node environment and is part of `npm test`.
- [x] Fixtures are excluded from the app build, the app typecheck, the real `src/` lint and lint-staged. lint-staged passes `--no-ignore`, so the exclusion goes in its glob.
- [x] The 3 deep imports are fixed by importing from the slice root: SendContactForm → ContactForm, MainPage → FilterPanel's EmptyFilterResults, Map types → LoadMap types.
- [x] The Navbar → AuthModal next-line disable names its rule and gives a reason that links a new `.scratch/architecture-debt/issues/01-<slug>.md`. The note has `Status: needs-triage` and records the rule, the file, and why the fix is a design question.
- [x] `lint:ts` and `lint:ts:fix` use the glob `"src/**/*.{ts,tsx}"`.
- [x] `npm run lint:ts` reports 0 problems, and `npm test` passes.

## Comments

- `@x` needs more than the spec's `entry-point` allow. `element-types` would still reject entities → entities, and allowing that would reopen same-layer imports through a slice root. So `entities/*/@x/*.ts` is its own element type, `entities-x`. An entity may import only the `@x/<its own name>.ts` of another entity, and an `@x` file may import only its own entity. Other layers can't use `@x` at all.
- `widgets/Map` → `features/LoadMap` types: `PlacesDataWithGeo` moved down to `shared/types`, and `EmptyFilterResults` moved from `components/` into FilterPanel's `ui/`, so the new root exports come from `./ui`.
- Harness: `lint-tests/architecture.test.ts` sets the ESLint cwd to `lint-tests/fixtures/` (so `src/…` override globs match) and swaps only the TS project and resolver to `lint-tests/fixtures/tsconfig.json`.
