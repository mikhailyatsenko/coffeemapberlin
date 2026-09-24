# Where does the nude-app convention differ from official FSD, and what should we adopt?

Type: research
Status: resolved

## Question

Compare the nude-app FSD convention (`/Users/mykhailoyatsenko/nude-app/CLAUDE.md`, "Architecture — FSD" section, and `agents.md`) with the current official Feature-Sliced Design docs (v2.1): layers, slices, segments, public API, no imports between slices on the same layer, cross-imports via `@x`, pages-first, what may and may not go in `shared`. List each difference and each official practice nude-app lacks, with a recommendation (adopt / skip / adapt) and a one-line reason for this repo (React 19, Apollo Client + GraphQL codegen, Zustand, SCSS). Also note where this repo's `src/` breaks the nude-app convention today (rough counts, not a migration plan).

## Answer

Findings: `.scratch/fsd-rules/research/01-fsd-best-practices-gap.md` on branch `research/fsd-best-practices-gap` (commit `8934757`).

What to adopt from official FSD v2.1 on top of nude-app:
- **No imports between slices on the same layer, on every layer** (nude-app only states it for `features`). Today there is one violation: `widgets/Navbar` → `widgets/AuthModal`.
- **`@x` cross-imports, on the `entities` layer only**, as the sanctioned way to couple two entities.
- **Pages-first**: UI that isn't reused stays inside the page (`pages/X/components/`) and moves down to widgets/features/entities only once something reuses it.
- **Adapt**: the root `index.ts` still exposes only `ui`, but prefers named re-exports (`export { Foo } from './ui'`) over `export *` when there is more than one symbol.
- **Tooling** (steiger or an ESLint boundaries config) is the subject of [Which tools can enforce the convention, and what would each flag here?](02-fsd-lint-tooling.md).

Already the same in both, nothing to do: the six layers (no `processes`) and imports that only point downward (0 violations today).

Skip: segment names (official advises against `components/`/`hooks/`/`types/`, but the nude-app set is already decided) and slice groups (layers are still flat).

Where `src/` breaks the convention today: 9 of 42 slice roots export more than `ui`; 8 of 11 `components/` folders have no `index.ts`; 3 deep imports into another slice; 1 import between slices on the same layer. `shared/query/*` (8 folders) and `shared/stores/*` (5) hold business domains. That is only an observation: `shared/` keeps its current layout.
