# 07: The Place page copes with nullable `characteristicCounts`

Status: done
Blocked by: backend coffemap-server `.scratch/backend-hardening/issues/09-schema-promises-only-returned-fields.md` (merged to its `main`)

## Problem

The backend schema no longer promises fields its resolvers never fill:

- `PlaceProperties.characteristicCounts` is now nullable (`CharacteristicCounts`, not `CharacteristicCounts!`). `place` still fills it; `places`, `filteredPlaces` and `neighborhoodShortlists` return `null`.
- `PlaceProperties.reviews` is gone. No operation here selects it.
- `Review.placeId` is now filled by `placeReviews`. Nothing to change here.

Nothing breaks at runtime: the `place` query still gets the counts. But once `npm run codegen` runs against the new schema, `PlaceQuery.place.properties.characteristicCounts` becomes `… | null | undefined`, and `tsc` fails with 6 errors (checked against the backend branch, see the backend ticket's Comments):

- `src/shared/api/hooks/useToggleCharacteristic.ts:32,41`: the optimistic cache update reads `characteristicCounts[characteristic]` and spreads it.
- `src/widgets/DetailedPlace/ui/DetailedPlace.tsx:217,248`: passes `characteristicCounts` to `Header` and `RateBlock`, whose props are non-null.
- `src/features/RateNow/ui/RateBlock.test.tsx:274,291`: the test harness does the same.

## Expected behaviour

- `DetailedPlace` hands `Header` and `RateBlock` all-zero counts (`pressed: false, count: 0` for every Characteristic) when `characteristicCounts` is null. The components' props stay non-null.
- `useToggleCharacteristic` skips the optimistic cache write when the cached Place has no `characteristicCounts`. The mutation itself still runs.
- `RateBlock.test.tsx` compiles against the new types.

## Acceptance criteria

- [x] `npm run codegen` against the backend's `main` (run it locally on port 3000) updates `src/shared/generated/graphql.ts`, and `characteristicCounts` in `PlaceQuery` is nullable.
- [x] `tsc` passes.
- [x] Test: with `characteristicCounts: null` in the `place` response, the Place page renders and the Characteristic questions start from zero counts.
- [x] Existing RateNow tests pass.

## Comments

**2026-09-29, implemented** (branch `fix/nullable-characteristic-counts`, from `main`).

- Backend: ran `coffemap-server` locally on port 3000 (already on `main`, which has ticket 09's merge, `51e4122`) and ran `npm run codegen`. `PlaceQuery.place.properties.characteristicCounts` is now `Maybe<CharacteristicCounts>` in `src/shared/generated/graphql.ts`; no operation here selects the removed `PlaceProperties.reviews`.
- New `ZERO_CHARACTERISTIC_COUNTS` constant (`src/shared/constants/characteristicCounts.ts`): all-zero, all-unpressed `CharacteristicCounts`, shared by production code and tests.
- `DetailedPlace.tsx` falls back to `ZERO_CHARACTERISTIC_COUNTS` when `characteristicCounts` is null before handing it to `Header` and `RateBlock`; their props stay non-null, unchanged.
- `useToggleCharacteristic`'s cache update also falls back to `ZERO_CHARACTERISTIC_COUNTS` when the cached Place has no `characteristicCounts`, instead of skipping the write. Code review (see below) caught that skipping meant a toggle would succeed on the server but never show up in the UI, and the same question would resurface as if nothing happened — falling back to the same zero baseline the page renders from fixes that, and it's exercised by a new regression test (`RateBlock.test.tsx`, "marks a Characteristic in 'Your marks' from the zero baseline when characteristicCounts starts null"), which I confirmed fails against the skip-based version before restoring the fix.
- `RateBlock.test.tsx` (its `PlaceQuery` test harness and `placeWith` fixture) and `DetailedPlace.test.tsx` (new test: "starts the Characteristic questions from zero counts when characteristicCounts is null") updated/added for the nullable type; `DetailedPlace.test.tsx`'s zero-counts fixture is now derived from `ZERO_CHARACTERISTIC_COUNTS`'s keys rather than hand-duplicated, per a code-review finding.
- `tsc --noEmit` is clean, `npx eslint` on touched files is clean bar one pre-existing unrelated warning, and the full suite passes 251/251 (`lint-tests/architecture.test.ts` included).
- Code review (medium): 2 findings, both fixed — see above (silent-drop cache bug; test fixture duplication). Two more low-confidence, non-blocking items were raised and dismissed: `RateBlockProps.characteristicCounts` staying non-null is intentional per this ticket's spec, not a gap; `shared/types/index.ts`'s hand-written `PlaceProperties`/`ICharacteristicCounts` are pre-existing dead code (unused anywhere in the codebase), untouched by this diff and out of its blast radius.
