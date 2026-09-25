# 03: Place page tests copy their fixtures between slices

Status: needs-triage

- **Rule:** the Duplicated Code smell (code-review baseline); no documented rule in `docs/agents/architecture.md` covers shared test helpers.
- **Files:**
  - `src/widgets/DetailedPlace/ui/DetailedPlace.test.tsx` repeats, near verbatim, from `src/features/RateNow/ui/RateBlock.test.tsx`: `FakeIntersectionObserver` with `reportVisibility`, `trackedEvents`, the `unmarked` Characteristic data and the Place fixture (`place()` vs `placeWith()`).
- **Why it wasn't fixed in place:** sharing them means a new cross-slice test helper (e.g. under `shared/lib` or a `test/` folder) and a decision on where test utilities live in the FSD layout; that is past the blast radius of ticket 07 (`.scratch/one-tap-contributions/issues/07-rate-block-waits-per-place.md`), which only touches `widgets/DetailedPlace`.
