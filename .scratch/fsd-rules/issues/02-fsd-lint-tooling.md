# Which tools can enforce the convention, and what would each flag here?

Type: research
Status: resolved

## Question

Evaluate the linters that can enforce FSD in this repo: `@feature-sliced/eslint-config` (maintained? which rules: `layers-slices`, `public-api`, `import-order`), steiger, `eslint-plugin-boundaries`, and plain `no-restricted-imports`. For each: is it maintained, does it work with this repo's ESLint 8 `.eslintrc.cjs` setup, and can it enforce (a) the layer order, (b) no imports between slices on the same layer, (c) imports only through the slice root `index.ts`, (d) no `components/` nested inside `components/`, (e) the allowed segment names? Try each on a scratch branch and report how many violations it finds in `src/` today.

## Answer

Findings: `.scratch/fsd-rules/research/02-fsd-lint-tooling.md` on branch `research/fsd-lint-tooling` (commit `56785c5`). All counts were taken with `--no-inline-config`.

- **`@feature-sliced/eslint-config` 0.1.1** is effectively unmaintained: last release 2024-04, README still says "WIP beta". `layers-slices` covers (a) and (b), with 1 hit: `Navbar` → `AuthModal`. Today that import is silenced by an `eslint-disable` comment, which is why lint passes clean. `public-api` gives 316 hits, about 95% noise, and misses one of the 3 known deep imports.
- **Steiger 0.6.0** is maintained and is the linter the FSD docs recommend, but it clashes with the convention. It flags the segments `components/`, `types/`, `constants/` and `hooks/`, and every `components/X/ui` folder. 122 of its 125 deep-import hits point into `shared/*`, and it takes no custom rules. **Skip.**
- **`eslint-plugin-boundaries`** configured directly (4.2.2 is already installed and works with ESLint 8 and `.eslintrc.cjs`) covers (a), (b) and (c). It finds exactly the 4 known violations. It has to replace the FSD preset rather than sit beside it.
- **Core ESLint rules with path-scoped `overrides`** need no new dependency:
  - (d) `components/` inside `components/`: 0 today;
  - (e) allowed segment names: 4 hits;
  - slice root `index.ts` re-exports only `./ui`: 9 hits.
  - Caveat: every override using `no-restricted-syntax` must repeat the global selectors, because overrides replace a rule's options instead of merging them.
- **(f) No Apollo or stores in `shared/ui/**` and `entities/*/ui/**`:** can be enforced with `@typescript-eslint/no-restricted-imports` and `allowTypeImports`. It finds 7 hits, all in `shared/ui/AddToFavButton`.
- **(g) `useXStore()` with no selector:** can be enforced with `no-restricted-syntax` `CallExpression[callee.name=/^use[A-Z]\w*Store$/][arguments.length=0]`. It finds 16 hits.

Counts today: (a)/(b) 1, (c) 3, (d) 0, (e) 4, (f) 7, (g) 16, root index 9.
