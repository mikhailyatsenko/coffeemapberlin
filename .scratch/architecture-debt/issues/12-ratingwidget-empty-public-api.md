# 12: RatingWidget has an empty public API, so every caller deep-imports it

Status: needs-triage

- **Rule:** `docs/agents/architecture.md`, FSD: a slice's `index.ts` is its public API and re-exports each public symbol by name. ESLint doesn't catch it inside `shared/ui`.
- **Files:** `src/shared/ui/RatingWidget/index.ts` is empty, and its callers import `shared/ui/RatingWidget/ui/RatingWidget` (and `BeanIcon`) directly, across about a dozen files in several slices; `src/shared/ui/RatingWidget/ui/RatingWidget.tsx` is also a default export.
- **Why it wasn't fixed in place:** filling the index (and moving to a named export) changes the public API of a slice that ticket 02 of `.scratch/typography-and-cards/` doesn't touch, and means editing every caller across slices. Ticket 02 added one more deep import in `src/shared/ui/RatingSummary/ui/RatingSummary.tsx` and removed two (in `PlaceCard` and `NeighborhoodPlaceCard`).
