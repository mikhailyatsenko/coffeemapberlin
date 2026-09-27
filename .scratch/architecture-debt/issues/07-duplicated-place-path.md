# 07: The Place page path is built by hand in many slices

Status: needs-triage

**Rule:** Duplicated Code (smell baseline in the code-review skill); `shared/` holds app-wide helpers (`docs/agents/architecture.md`, FSD).

**Where:** `generatePath(\`/${RoutePaths.placePage}\`, { id })` repeats in PlaceCard, SEOPlacesList, TooltipCardOnMap, NeighborhoodPlaceCard, ReviewActivityCard and `pages/SuggestPlacePage` (SimilarPlaces). `pages/SuggestionReviewPage/lib/links.ts` now has a local `placePath` for its three uses (place-suggestions ticket 05).

**Why past the blast radius:** one `placePath` in `shared/lib` (or next to `RoutePaths` in `shared/constants`) means edits across layers and slices that ticket 05 doesn't touch.
