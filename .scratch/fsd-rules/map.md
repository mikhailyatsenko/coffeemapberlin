# FSD and SOLID rules for agents

Label: wayfinder:map

## Destination

A spec for the architecture-rules document for Claude Code agents: its content (FSD conventions, SOLID heuristics for React/TS), how it's loaded, and which rules a linter enforces vs. which stay as text for review. Writing the document and setting up the linters go to `to-spec` / `to-tickets`.

## Notes

- Audience: Claude Code agents only. Not Cursor, not human contributors.
- Scope of the rules: new code, plus code the change touches (boy-scout rule). No mass migration.
- Reference repo: `/Users/mykhailoyatsenko/nude-app` (its `CLAUDE.md` "Architecture — FSD" section, `agents.md`). Model the rules on its approach.
- Decided while charting:
  - Segments follow nude-app: `ui/`, `components/`, `types/`, `constants/`, `lib/`, `model/`, `api/`, `hooks/`, `mappers/`, and a root `index.ts` that only does `export * from './ui'`. `components/X/` is a mini-slice (may have `ui/`, `lib/`, `types/`…) but **never** its own `components/`; a sub-component's sub-component sits beside it in the same `components/`. `shared/` keeps this repo's current layout (`shared/ui`, not `shared/components`).
  - The document is `docs/agents/architecture.md`, pulled into `CLAUDE.md` with an `@docs/agents/architecture.md` import (always loaded; `code-review` picks it up as a standards source).
  - `.cursorrules` is deleted in the same change that adds the document.
- SOLID is a set of heuristics that review flags, never a blocking rule.
- State before this effort: ESLint runs `@feature-sliced/eslint-config` `layers-slices` + `import-order` and passes clean; the `public-api` rule isn't enabled; no steiger.
- Every grilling session: call the Skill tool for "grilling" and "domain-modeling".

## Decisions so far

- [Which tools can enforce the convention, and what would each flag here?](issues/02-fsd-lint-tooling.md): boundaries configured directly instead of the unmaintained FSD preset for (a)–(c); core ESLint overrides for (d)/(e)/root index; skip Steiger; the no-Apollo/stores rule in `ui/` (7 hits) and `useXStore()` without a selector (16 hits) can be linted
- [Where does the nude-app convention differ from official FSD, and what should we adopt?](issues/01-fsd-best-practices-gap.md): nude-app matches on layers and import direction; adopt a ban on same-layer imports for every layer, `@x` only in entities, pages-first, named re-exports in index.ts; today 9/42 roots export more than ui, 3 deep imports, 1 same-layer import
- [Which SOLID heuristics go into the rules, and how are they worded for React/TS?](issues/03-solid-heuristics.md): four judgement-call heuristics in baseline format (Component doing several jobs / Flag props for variants / Wide props / Whole-store subscription); no DIP or LSP; generated Apollo hooks allowed in feature and page `ui/`; one Middle Man override
- [Which rules does the linter enforce, and which stay as text for review?](issues/04-lint-vs-text.md): boundaries 4.2.2 directly replaces the FSD `layers-slices` preset; (a)–(f) at `error` (fix the 3 deep imports and 4 segments, keep an `eslint-disable` with a reason on Navbar and AddToFavButton), whole-store subscription and root-index exports at `warn`; checks run only in the existing lint-staged pre-commit, plus a fix to the `lint:ts` glob; the text states once that ESLint covers these and drops heuristic 4
- [Where does the boy-scout rule stop?](issues/06-boy-scout-limit.md): don't make it worse (always) + fix existing violations only inside a slice the diff changes and without changing its public API; beyond that, a `needs-triage` note in `.scratch/architecture-debt/`; new `eslint-disable` only for `error` rules needing a design change, next-line with a reason linking the note, enforced by eslint-comments + `reportUnusedDisableDirectives`
- [What shape does `docs/agents/architecture.md` take?](issues/05-document-shape.md): one file, ≤120 lines; sections Scope → Enforced by ESLint → FSD → SOLID heuristics → Boy-scout and debt → Review; at most two short code examples (named re-exports, flag props); no references to `src/` files; written with `writing-for-agents`

## Not yet specified

Nothing left: every ticket is resolved; the way to the spec is clear.

## Out of scope

- Migrating existing code to the convention (boy-scout only).
- Rules for Cursor or human contributors.
- Rules for the backend (`../coffemap-server`).
- Porting nude-app's `.claude/commands/refactor.md` migration command.
