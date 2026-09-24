# 08: Segment structure rules

**What to build:** Folder structure can't drift. A file in a slice segment with an unknown name, a `components/` nested inside `components/`, or a slice root `index.tsx` fails lint at `error`. The allowed segments for layer slices are `ui`, `components`, `types`, `constants`, `lib`, `model`, `api`, `hooks` and `mappers`. `components/X` allows the same set except `components`. The root `index.ts` is the only loose file allowed. The 4 existing violations are fixed.

See [spec](../spec.md): "ESLint configuration" rules (d) and (e), and "One-off fixes". Override config: research 02 on branch `research/fsd-lint-tooling`.

**Blocked by:** 07 (Lint test harness and layer boundaries through boundaries).

**Status:** resolved

- [x] Rules (d) and (e) are path-scoped `no-restricted-syntax` overrides at `error`, with messages in the form "what is wrong → how to fix".
- [x] The (d) message wins when both (d) and (e) apply to a file.
- [x] The test covers, each with a violating and an allowed fixture: an unknown segment in a slice, an unknown segment in `components/X`, a nested `components/`, and a root `index.tsx`.
- [x] AddTextReview's `utils/` is renamed to `lib/`.
- [x] The loose files in DetailedPlace's `CoffeeShopSchema` and OpeningHours' `OpeningHoursList` move into their `ui/`.
- [x] FavoritesIndicator's root `index.tsx` becomes `index.ts`.
- [x] `npm run lint:ts` reports 0 problems, and `npm test` passes.
