# 06: Search's name matching is exported from a feature's `lib`

Status: needs-triage

- **Rule:** `docs/agents/architecture.md`, FSD segments: a slice's `index.ts` re-exports from `./ui` only. `features/SearchPlaces/index.ts` also re-exports `./lib/filterPlacesByName`.
- **Files:**
  - `src/features/SearchPlaces/index.ts` (the export)
  - `src/pages/MainPage/ui/MainPage.tsx` and `src/pages/SuggestPlacePage/components/SimilarPlaces/model/useSimilarPlaces.ts` (the two consumers)
- **Why it wasn't fixed in place:** the matching is a pure function now shared by two pages, so it belongs in `shared/lib`. Moving it crosses slices and layers and changes `features/SearchPlaces`'s public API, which is past the blast radius of `.scratch/place-suggestions/issues/02-suggest-form.md`. That ticket only made the function generic and added the second consumer.
