# Spec: FSD and SOLID rules for agents

Status: resolved
Map: [FSD and SOLID rules for agents](map.md)

## Problem Statement

Claude Code agents working in this repo have no reliable architecture guide. The only written rules sit in `.cursorrules`, which Claude Code never loads and which has drifted from the convention the owner now wants (modelled on the nude-app repo). The linter checks layer order through an unmaintained FSD preset, leaves public-API, segment and data-access rules unchecked, and one violation is silently suppressed. `npm run lint:ts` lints no `.tsx` files at all because of a broken glob. As a result, agents invent structure per task: deep imports into other slices, unknown segment folders, data access inside `shared/ui`, whole-store subscriptions, flag-prop variants. `code-review` has no project standard to judge any of this against.

## Solution

One short architecture document, `docs/agents/architecture.md`, loaded into every Claude Code session through an `@` import in `CLAUDE.md`. It holds only what a linter can't check: the purpose of each FSD layer and segment, pages-first, named re-exports, `@x` on entities, three SOLID heuristics for React/TS, the boy-scout limit, the debt-note and `eslint-disable` policy, and how `code-review` treats all of it. Everything mechanical moves into ESLint: `eslint-plugin-boundaries` configured directly for layers and public API, path-scoped core rules for segment names, data imports in presentational layers, whole-store subscriptions and root `index.ts` exports, and `eslint-comments` for disable hygiene. Each rule message says what is wrong and how to fix it. Checks keep running in the existing lint-staged pre-commit. A single vitest file proves each rule fires on a violation and stays quiet on allowed code. `.cursorrules` is deleted.

## User Stories

1. As a Claude Code agent, I want the architecture rules loaded into every session automatically, so that I don't have to know a document exists before I follow it.
2. As a Claude Code agent, I want the rules document short (at most 120 lines), so that it costs little context in every session.
3. As a Claude Code agent, I want the document to tell me that ESLint enforces layers, public API, segment names, data imports in `shared/ui`/`entities/*/ui` and store subscriptions, so that I read the lint message instead of looking for prose.
4. As a Claude Code agent, I want each lint message to state what is wrong and how to fix it, so that I can fix a violation without opening the document.
5. As a Claude Code agent, I want a one-phrase purpose for each layer, so that I place a new slice on the right layer.
6. As a Claude Code agent, I want the purpose of each segment (`ui/`, `components/`, `types/`, `constants/`, `lib/`, `model/`, `api/`, `hooks/`, `mappers/`), so that I put code in the right folder, not just a folder with an allowed name.
7. As a Claude Code agent, I want to know that `components/X/` is a mini-slice with the same segments but never its own `components/`, so that I place a sub-component's sub-component beside it.
8. As a Claude Code agent, I want to know the `shared/` layout stays as it is (`shared/ui`, `shared/stores`, `shared/query` …), so that I don't "fix" it toward nude-app's `shared/components`.
9. As a Claude Code agent, I want the pages-first rule, so that UI used by one page stays in that page's `components/` until something reuses it.
10. As a Claude Code agent, I want the root `index.ts` to re-export only from `./ui` with named re-exports, so that a slice's public API stays explicit.
11. As a Claude Code agent, I want a tiny example of named re-export vs `export *`, so that I get it right the first time.
12. As a Claude Code agent, I want to know `@x` cross-imports exist only between entities, and why, so that I couple two entities the sanctioned way and never features.
13. As a Claude Code agent, I want the "Component doing several jobs" heuristic with its fix (move logic into a slice hook), so that I keep `ui/` for rendering.
14. As a Claude Code agent, I want the "Flag props for variants" heuristic and a tiny example of `variant`/composition, so that I don't add a second variant-switching boolean.
15. As a Claude Code agent, I want the "Wide props" heuristic with its whole-domain-concept exception, so that I narrow props without splitting a card that renders a whole `Place`.
16. As a Claude Code agent, I want to know that calling generated Apollo hooks directly from a feature's or page's `ui/` is allowed, and that a thin wrapper without logic is Middle Man, so that I don't write wrappers for DIP's sake.
17. As a Claude Code agent, I want to know a hook that wraps a generated hook and adds `onCompleted`, a cache `update` or mapping is not Middle Man, so that I keep such hooks.
18. As a Claude Code agent, I want the "don't make it worse" rule stated as absolute, so that I fix a violation my own diff introduces within the ticket instead of writing a note.
19. As a Claude Code agent, I want the boy-scout limit stated as a blast radius (inside a slice the diff changes, public API unchanged) with in/out examples, so that I know when to fix an existing violation and when to stop.
20. As a Claude Code agent, I want to know that out-of-limit fixes become a `needs-triage` note in `.scratch/architecture-debt/issues/`, what the note records, and that my final report links it, so that debt is tracked and not lost in `// TODO`s.
21. As a Claude Code agent, I want the exact conditions for a new `eslint-disable` (an `error` rule, a design-level fix, next-line form naming the rule, a reason linking the debt note, mentioned in the report), so that I never suppress a local fix.
22. As a Claude Code agent, I want lint to reject a disable without a description or without a named rule, so that a sloppy disable can't be committed.
23. As a Claude Code agent, I want lint to report a disable that no longer suppresses anything, so that I remove it once the violation is fixed.
24. As a `code-review` run, I want the architecture document in `CLAUDE.md`, so that I pick it up as a standards source.
25. As a `code-review` run, I want a diff line that breaks a text rule to be a normal finding, so that new violations are reported.
26. As a `code-review` run, I want an unfixed in-limit existing violation to be a non-blocking "boy-scout: fixable within this ticket" finding, so that improvement is nudged but not forced.
27. As a `code-review` run, I want an out-of-limit existing violation to be no finding when a debt note exists and a suggestion to file one when none does, so that I don't repeat known debt.
28. As a `code-review` run, I want the SOLID heuristics flagged as "possible …" judgement calls, each with its line on how it differs from the nearest baseline smell, so that I don't report one spot twice.
29. As a `code-review` run, I want the Review rules in the last section, so that I find them without reading the whole document.
30. As the repo owner, I want layer order and no same-layer slice imports enforced at `error` on every layer, so that no agent can create an upward or sideways dependency.
31. As the repo owner, I want imports into another slice allowed only through its root `index.ts` (plus `@x/*.ts` on entities), so that slice internals stay private.
32. As the repo owner, I want unknown segment names and `components/` inside `components/` rejected at `error`, so that the folder structure can't drift.
33. As the repo owner, I want `shared/ui`, `entities/*/ui` and `entities/*/components` barred from importing Apollo, stores, `shared/query`, the Apollo client config and `shared/api`, with type-only imports still allowed, so that presentational layers get data only through props.
34. As the repo owner, I want whole-store subscriptions and non-`./ui` root exports at `warn`, so that lint-staged forces a fix in every touched file without blocking unrelated work.
35. As the repo owner, I want the 3 deep imports and 4 bad segments fixed once, so that the new `error` rules start clean.
36. As the repo owner, I want the two design-level violations (Navbar → AuthModal, data access in `AddToFavButton`) kept under a named, reasoned disable that links a debt note, so that they stay visible until someone redesigns them.
37. As the repo owner, I want `npm run lint:ts` to lint every `.ts` and `.tsx` file under `src/`, so that manual runs see what pre-commit sees.
38. As the repo owner, I want the unmaintained FSD `layers-slices` preset gone and boundaries pinned exactly, so that a transitive upgrade can't change the rules.
39. As the repo owner, I want a test that fails when a rule stops firing or starts firing on allowed code, so that a config edit can't silently weaken the rules.
40. As the repo owner, I want `.cursorrules` deleted in the same change, so that no second, stale rule set remains.
41. As the repo owner, I want the document free of references to real files in `src/`, so that it doesn't go stale as boy-scout fixes land.

## Implementation Decisions

### The document

- One file, `docs/agents/architecture.md`, English, imperative, one rule per bullet. It is written with the `writing-for-agents` skill (a requirement, not a suggestion).
- Hard limit: 120 lines. This is an acceptance criterion.
- Sections, in this order:
  1. **Scope**: one line. The rules apply to new code and to code a change touches.
  2. **Enforced by ESLint**: one line. Layers, public API, segment names, data imports in `shared/ui`/`entities/*/ui`, and store subscriptions are checked by ESLint, and the message says how to fix. The document doesn't restate these rules.
  3. **FSD**: the layer tree with one phrase per layer; the segment tree with each segment's purpose, `components/X` as a mini-slice that never nests `components/`, and a root `index.ts` that re-exports only from `./ui`; the `shared/` layout as it is today; pages-first; named re-exports over `export *`; `@x` on entities only, with the intent. A short *why* appears only where lint checks a rule halfway (segment names are linted, segment content is not).
  4. **SOLID heuristics**: heuristics 1–3 from the map's SOLID ticket in the `**Name** (letter): what it is → how to fix` baseline format, each with its one line on the nearest baseline smell (Divergent Change, Speculative Generality, Data Clumps). Marked as judgement calls flagged as "possible …". Also the Middle Man override and the "don't wrap a generated hook for DIP's sake" line. Heuristic 4 (whole-store subscription) is not in the text: lint covers it.
  5. **Boy-scout and debt**: don't make it worse (absolute); the blast-radius limit with its in/out lists; SOLID 2 only as don't-make-it-worse; the debt note (location, `Status: needs-triage`, what it records, linked from the final report; no standalone `// TODO`); the four `eslint-disable` conditions.
  6. **Review**: the three `code-review` rules (new violation = finding; in-limit leftover = non-blocking "boy-scout: fixable within this ticket"; out-of-limit = no finding if a debt note exists, otherwise suggest filing one).
- At most two code examples, each 6 lines or fewer: named re-export vs `export *`, and flag props vs `variant`/composition.
- No references to files in `src/`: no anti-examples, no reference slice. The segment tree is the reference.
- `CLAUDE.md` gets an `@docs/agents/architecture.md` import (its own short section). `.cursorrules` is deleted in the same change.

### ESLint configuration (ESLint 8, `.eslintrc.cjs`)

- Remove the `@feature-sliced/eslint-config/rules/layers-slices` extend. Keep the `import-order` extend as it is.
- Pin `eslint-plugin-boundaries` as a direct devDependency at exactly `4.2.2`. Upgrading to 7.x is not part of this work.
- Configure boundaries directly, following the config in research 02 (branch `research/fsd-lint-tooling`, `.scratch/fsd-rules/research/02-fsd-lint-tooling.md`):
  - elements: `app` as one element; each slice of `pages`/`widgets`/`features`/`entities` as its own element; each `shared/*` segment as its own element.
  - `boundaries/element-types` at `error`, `default: disallow`: each layer may import only the layers below it; slices on the same layer never import each other (covers rules (a) and (b)).
  - `boundaries/entry-point` at `error`, `default: disallow`: slices on `pages`/`widgets`/`features`/`entities` are entered only through their root `index.(ts|tsx)`; `entities` also allow `@x/*.ts`; `app` and `shared` allow any path (rule (c)).
- Path-scoped `overrides` with core / `@typescript-eslint` rules, using the research 02 selectors:
  - (d) `components/` inside `components/`: `error`.
  - (e) allowed segment names for layer slices and for `components/X` (`ui`, `components`, `types`, `constants`, `lib`, `model`, `api`, `hooks`, `mappers`; `components/X` without `components`), with the root `index.ts` as the only loose file. A root `index.tsx` is not allowed. `error`.
  - (f) `@typescript-eslint/no-restricted-imports` on `shared/ui/**`, `entities/*/ui/**`, `entities/*/components/**`: bans `@apollo/client` (with `allowTypeImports`), `shared/stores`, generated hooks (`importNamePattern: '^use'` on the generated GraphQL module), the Apollo client config, `shared/query/**` and `shared/api`. `error`.
  - (g) whole-store subscription, `CallExpression` of a `use…Store` identifier with zero arguments: `warn`, global.
  - Slice root `index.ts` re-exports only from `./ui`: `warn`.
- **Decision on the open question**: `export { X } from './ui/X'` in a root `index.ts` counts as "from `./ui`" and is allowed. The research 02 selector already matches `./ui` and `./ui/…`, the rule's intent is "expose only the `ui` segment", and forbidding the subpath would add churn with no architectural gain. Named re-exports are still preferred over `export *` (a text rule, not linted).
- Every override that sets `no-restricted-syntax` repeats the global (g) selector, because overrides replace a rule's options instead of merging them. The spec's test covers this (see Testing).
- Every rule `message` reads "what is wrong → how to fix".
- Disable hygiene: add `@eslint-community/eslint-plugin-eslint-comments` with `require-description` and `no-unlimited-disable`, and turn on `reportUnusedDisableDirectives` so it blocks the commit under lint-staged's `--max-warnings=0`.

### Scripts and hooks

- `lint:ts` and `lint:ts:fix` use the glob `"src/**/*.{ts,tsx}"` (today's `"**/*.{ts, tsx}"` lints no `.tsx` because of the space).
- Checks run only in the existing husky pre-commit (lint-staged `eslint --fix --max-warnings=0 --no-ignore`, then `npm test`). No CI is added.
- Lint-staged must not lint the test fixtures, which break rules on purpose. Because lint-staged passes `--no-ignore`, `.eslintignore` is not enough: the lint-staged glob excludes the fixtures directory.

### One-off fixes in `src/`

- The 3 deep imports: `features/SendContactForm` → `entities/ContactForm`; `pages/MainPage` → `features/FilterPanel`'s `EmptyFilterResults`; `widgets/Map` types → `features/LoadMap` types. Each is fixed by importing from the slice root, exporting from that root what it needs (through `./ui`, or moving a shared type down to where both sides may import it).
- The 4 bad segments: `utils/` → `lib/` in `features/AddTextReview`; the two loose files in `components/X/` (`DetailedPlace`'s `CoffeeShopSchema`, `OpeningHours`' `OpeningHoursList`) move into `ui/`; `entities/FavoritesIndicator/index.tsx` → `index.ts`.
- Navbar → AuthModal: keep the next-line disable, add a reason that links a new architecture-debt note ("where AuthModal lives" is a design question).
- `shared/ui/AddToFavButton`: file-level disables in the component and its cache-update helper, naming the rule(s) and giving a reason with a TODO that links a new architecture-debt note. This is the only file-level disable allowed.
- Create `.scratch/architecture-debt/issues/` with those two notes, `Status: needs-triage`, each recording the rule broken, the file, and why it wasn't fixed here.
- The 16 whole-store subscriptions and 9 root-index hits are not fixed in this work: they are `warn` and get fixed boy-scout when their files are touched.
- After these fixes `npm run lint:ts` passes with 0 problems.

## Testing Decisions

- **One seam: the ESLint configuration, as a black box.** One vitest file drives the real `.eslintrc.cjs` through the ESLint Node API and asserts which rule ids fire on fixture files. It never inspects the config object itself.
- A good test here states: "a file at this path with this import/export/call gets rule X" or "gets nothing". It asserts rule ids (and, for `warn` vs `error`, severity), not message text.
- Cases, each with one violating and one allowed fixture:
  - (a) upward import; (b) same-layer slice import;
  - (c) deep import into another slice vs import from its root; `@x/*.ts` allowed on entities and rejected on features;
  - (d) `components/` nested in `components/`;
  - (e) unknown segment in a slice and in `components/X`; a root `index.tsx`;
  - (f) a store import and a generated hook in `shared/ui` vs a type-only `@apollo/client` import there; a generated hook allowed in a feature's `ui/`;
  - (g) `useXStore()` vs `useXStore((s) => s.x)`, including inside a file covered by a `no-restricted-syntax` override (proves the selectors are repeated);
  - root `index.ts`: `export *` from `./model` warns; `export { X } from './ui'` and `from './ui/X'` pass;
  - `eslint-comments`: a disable without description and an unlimited disable are reported; an unused disable is reported.
- Fixtures live on disk in a dedicated directory whose tree mirrors `src/`'s layer layout, because boundaries and the import resolver need real files and typed linting needs them in a TS project. The implementer picks the exact mechanics (fixture cwd with the repo config passed explicitly, or a fixture-only tsconfig) and must keep the fixtures out of the app build, the app typecheck, the real `src/` lint and lint-staged.
- The test runs in the node environment (the vitest default here is jsdom), set per file.
- It runs in `npm test`, so it runs in pre-commit.
- Prior art: none for lint config. Existing vitest tests are component tests colocated in `src/` (e.g. the SearchPlaces and RateNow tests); only the runner and conventions carry over.
- The document itself is not tested automatically. Acceptance: at most 120 lines, the six sections in order, at most two examples, no `src/` file references.

## Out of Scope

- Migrating existing code to the convention beyond the one-off fixes above (boy-scout only). The 16 whole-store subscriptions and 9 root-index hits stay until touched.
- Resolving the two design-level violations (where AuthModal lives; data access in `AddToFavButton`): they get debt notes.
- Upgrading `eslint-plugin-boundaries` to 7.x, or ESLint to 9 / flat config.
- Steiger, and the FSD `public-api` preset.
- CI.
- Changing the `shared/` layout.
- Rules for Cursor, human contributors, or the backend (`../coffemap-server`).
- Porting nude-app's `refactor` migration command.
- Changes to `CONTEXT.md`: these are code terms, not domain terms.

## Further Notes

- Decisions and their reasoning live in the map's tickets: [map.md](map.md) and `issues/01`–`06`. Configs and hit lists are in research 02 on branch `research/fsd-lint-tooling`; the FSD gap analysis is research 01 on `research/fsd-best-practices-gap`.
- Reference for tone and scope: `/Users/mykhailoyatsenko/nude-app/CLAUDE.md`, section "Architecture — FSD".
- Counts as of charting: (a)/(b) 1, (c) 3, (d) 0, (e) 4, (f) 7, (g) 16, root index 9. Re-check before fixing; the code may have moved.
