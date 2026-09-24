# Which rules does the linter enforce, and which stay as text for review?

Type: grilling
Status: resolved
Blocked by: 01, 02

## Question

Given the adopted FSD practices and the tooling findings, decide for each rule whether a linter enforces it (which tool, error or warn, what to do with existing violations: fix, ignore list, or warn-only) or it stays as text in `docs/agents/architecture.md` for agents and `code-review` to apply. The text should skip what tooling already enforces.

Also decide, from [Which SOLID heuristics go into the rules, and how are they worded for React/TS?](03-solid-heuristics.md):
- whether a linter enforces "`shared/ui` and `entities/*/ui` import neither Apollo nor stores" (an FSD rule that came out of turning down DIP);
- whether a linter catches "Whole-store subscription" (`useXStore()` with no selector). If so, the heuristic comes out of the text.

## Answer

Facts found while resolving: husky pre-commit already runs lint-staged `eslint --fix --max-warnings=0` on staged `.ts/.tsx`, so a `warn` blocks the commit of any touched file. There is no CI. `npm run lint:ts` uses the glob `"**/*.{ts, tsx}"`, whose space means it lints 0 `.tsx` files.

**Tooling.** Drop `@feature-sliced/eslint-config/rules/layers-slices` and configure `eslint-plugin-boundaries` directly (`element-types` + `entry-point`, config in research 02), pinned at 4.2.2 as a direct devDependency. Upgrading to 7.x is not part of this effort. Keep the preset's `import-order` extend as it is. All other rules are core ESLint / `@typescript-eslint` rules in path-scoped `overrides`, using the configs from research 02. No Steiger.

**Per rule:**

| Rule | Tool | Level | Existing violations |
|---|---|---|---|
| (a)/(b) layer order, no same-layer slice imports | `boundaries/element-types` | error | Navbar → AuthModal: keep the inline `eslint-disable`, with a reason added. Fixing it is a design question (where AuthModal lives), not boy-scout |
| (c) import another slice only through its root `index.ts`; `@x/*.ts` allowed on `entities` only | `boundaries/entry-point` | error | 3 deep imports: fix in the lint-setup ticket |
| (d) no `components/` inside `components/` | `no-restricted-syntax` override | error | 0 |
| (e) allowed segment names (layer slices and `components/X`) | `no-restricted-syntax` overrides | error | 4: fix in the lint-setup ticket (`utils/`→`lib/`, 2 loose files into `ui/`, `index.tsx`→`index.ts`) |
| (f) `shared/ui/**`, `entities/*/ui/**`, `entities/*/components/**` import neither Apollo nor stores | `@typescript-eslint/no-restricted-imports`, `allowTypeImports`, group also includes `shared/api` | error | 7, all in `shared/ui/AddToFavButton`: file-level `eslint-disable` with a TODO |
| (g) whole-store subscription `use…Store()` with no selector | `no-restricted-syntax` | warn | 16: fixed boy-scout when the file is touched (lint-staged blocks it) |
| slice root `index.ts` re-exports only from `./ui` | `no-restricted-syntax` override | warn | 9: fixed when that `index.ts` is touched |

Policy behind the levels: `error` plus a one-off fix when the existing hits are few and mechanical; `warn` (which lint-staged turns into a block for touched files) when each fix is local; `error` plus an `eslint-disable` with a reason when the fix is a design change or a refactor of its own.

Every overriding `no-restricted-syntax` repeats the global selectors, because overrides replace options instead of merging them. Every rule `message` reads "what is wrong → how to fix".

**Where checks run.** Only the existing pre-commit hook. Fix the `lint:ts` glob to `"src/**/*.{ts,tsx}"` so manual runs see components. No CI.

**Text in `docs/agents/architecture.md`.** One line: layers, public API, segment names, data imports in `shared/ui` / `entities/*/ui`, and store subscriptions are checked by ESLint, and the error message says how to fix. The text doesn't restate these rules. It keeps the *why* where lint checks only half (segment names are linted, what goes in each segment is not). Text-only rules: pages-first, named re-exports over `export *`, each segment's purpose, `components/X` as a mini-slice, `@x` on entities only (the intent), SOLID heuristics 1–3, the Middle Man override, the `shared/` layout. Heuristic 4 (Whole-store subscription) comes out of the text, because (g) lints it.
