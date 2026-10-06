# 03: Place page tests copy their fixtures between slices

Status: needs-triage

- **Rule:** the Duplicated Code smell (code-review baseline); no documented rule in `docs/agents/architecture.md` covers shared test helpers.
- **Files:**
  - `src/widgets/DetailedPlace/ui/DetailedPlace.test.tsx` repeats, near verbatim, from `src/features/RateNow/ui/RateBlock.test.tsx`: `FakeIntersectionObserver` with `reportVisibility`, `trackedEvents`, the `unmarked` Characteristic data and the Place fixture (`place()` vs `placeWith()`).
  - `src/features/PlaceCard/ui/PlaceCard.test.tsx` (ticket 02 of `.scratch/typography-and-cards/`) builds a `GetPlaces` Place `properties` fixture that repeats the shape in `src/pages/MainPage/ui/MainPage.test.tsx` and `src/features/SearchPlaces/lib/filterPlacesByName.test.ts`; adding `ratingCount` to `GetPlaces` meant editing every copy.
  - `src/entities/NeighborhoodPlaceCard/ui/NeighborhoodPlaceCard.test.tsx` repeats the `FilteredPlacesQuery` Place fixture shape from `src/pages/NeighborhoodPage/ui/NeighborhoodPage.test.tsx` (`place()`); added by ticket 04 of `.scratch/ui-quick-fixes/`.
- **Why it wasn't fixed in place:** sharing them means a new cross-slice test helper (e.g. under `shared/lib` or a `test/` folder) and a decision on where test utilities live in the FSD layout; that is past the blast radius of ticket 07 (`.scratch/one-tap-contributions/issues/07-rate-block-waits-per-place.md`), which only touches `widgets/DetailedPlace`.
