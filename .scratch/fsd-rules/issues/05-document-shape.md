# What shape does `docs/agents/architecture.md` take?

Type: grilling
Status: resolved
Blocked by: 01, 03, 04, 06

## Question

The content is settled once [Where does the boy-scout rule stop?](06-boy-scout-limit.md) is resolved: the text-only FSD rules from [Which rules does the linter enforce, and which stay as text for review?](04-lint-vs-text.md) and SOLID heuristics 1–3 from [Which SOLID heuristics go into the rules, and how are they worded for React/TS?](03-solid-heuristics.md). Decide the shape: one file or split FSD and SOLID, section order, target length (it is loaded into every session through `@` import), how many right/wrong code examples and for which rules, and whether it points at real files in `src/` as examples.

## Answer

Fact found while resolving: no slice in `src/` can serve as a clean reference today. `features/FilterPanel` has no `ui/index.ts` or `components/index.ts`, and its root re-exports from `./ui/FilterPanel`. `widgets/DetailedPlace` has loose files in `components/X/` and a `components/X/` without `index.ts`. `features/AccountSettings` has no `components/index.ts`. Side note for the spec: the root-`index.ts` lint rule from [Which rules does the linter enforce, and which stay as text for review?](04-lint-vs-text.md) must say whether `from './ui/X'` counts as "from `./ui`" (several roots use that form).

**One file**: `docs/agents/architecture.md`, pulled in by a single `@` import. No split into FSD and SOLID files, and no on-demand second file, because an agent may never open it.

**Budget**: at most 120 lines. This is an acceptance criterion in the spec.

**Section order**:
1. One line on purpose and scope (new code plus code the change touches).
2. **Enforced by ESLint**: the one line from ticket 04.
3. **FSD**: the layer tree with one phrase per layer; the segment tree with each segment's purpose (including `components/X` as a mini-slice that never nests `components/`); the `shared/` layout; pages-first; named re-exports over `export *`; `@x` on entities only.
4. **SOLID heuristics**: 1–3 in baseline format, each with its line on the nearest baseline smell, plus the Middle Man override and the "don't wrap generated hooks for DIP's sake" line. Marked as judgement calls, flagged as "possible …".
5. **Boy-scout and debt**: don't make it worse; the blast-radius limit with the in/out examples; notes in `.scratch/architecture-debt/issues/`; the `eslint-disable` conditions.
6. **Review**: the three rules for `code-review` from [Where does the boy-scout rule stop?](06-boy-scout-limit.md), last so review finds them.

**Code examples**: at most two, each 6 lines or fewer, only where prose is weak: named re-export vs `export *`, and flag props vs `variant`/composition. Every other rule is one "what is wrong → how to fix" line.

**References to `src/`**: none. No anti-examples (they go stale once fixed by boy-scout; `ReviewCard` is not named) and no reference slice (none is clean, see the fact above). The segment tree is the reference.

**Style**: English, imperative, one rule per bullet, a short *why* only where lint checks a rule halfway. The document is written using the `writing-for-agents` skill; the spec states this as a requirement.
