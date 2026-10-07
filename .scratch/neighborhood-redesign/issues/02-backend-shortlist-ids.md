# 02: Backend: `shortlistIds` on Place properties

**What to build:** `filteredPlaces` and `neighborhoodShortlists` tell for each Place which Shortlists' Amenities it has, so cards can show Amenity icons without the frontend knowing Google's spellings. Backend only, in `../coffemap-server`. Spec: [Neighborhood page redesign](../spec.md), "Backend: shortlistIds on Place properties".

**Before the first edit in `../coffemap-server`:** ask the owner whether to make this change in the current session or hand it to a separate backend session (CLAUDE.md, Backend). If handed off, write it as a ready-for-agent ticket in the backend's tracker.

**Blocked by:** None (can start immediately)

**Status:** done

- [x] `PlaceProperties` gains `shortlistIds: [ShortlistId!]!`: every Shortlist whose Amenities the Place has, each through its synonyms; the 4.0 Average rating threshold does not apply
- [x] Order follows the server's Shortlist order; a Place with none returns `[]`; other queries return `[]`, never null
- [x] It reuses the existing Shortlist definitions and Amenity synonym table, no second copy of the rule; raw `additionalInfo` stays out of these responses
- [x] Resolver tests (`filteredPlaces`, `neighborhoodShortlists`, throwaway mongod): a synonym spelling counts (only "Free Wi-Fi" + laptop → `work`); Work is missing with one of its two Amenities; a Place below 4.0 still gets its ids; none → `[]`; server order
- [x] The local server is rebuilt and a query against it shows `shortlistIds` for Places of one Neighborhood

## Comments

**2026-10-06, done in `../coffemap-server`, branch `feat/shortlist-ids` (5ef3168, ace43cb), merged into `main` (26f332e), not pushed.**
- `shortlistIds` is computed in `getFilteredPlacesWithStats` from `SHORTLISTS` through one shared `hasAllAmenities` expression. The Amenity filter's `$match` uses the same expression, so there is no second copy of the rule. `place` and `places` return `[]`.
- Tests: 1 in `tests/filteredPlaces.test.ts` (synonym spelling) and 2 in `tests/neighborhoodShortlists.test.ts` (server order, Work with one Amenity, below 4.0, none → `[]`, no `additionalInfo`). Full suite: 371/372. The one failure is the unrelated `deleteReviewLeaseRace` test, which is flaky under load and passes 3/3 when run alone.
- Local server on :3000 (`/coffee`), real DB: `filteredPlaces(Friedrichshain-Kreuzberg)` returns 72 Places with `shortlistIds`, e.g. Coffee Karros → `work, dogFriendly, outdoorSeating, breakfastBrunch`. `neighborhoodShortlists` fills it too. `places` returns `[]` for all 405 Places.

