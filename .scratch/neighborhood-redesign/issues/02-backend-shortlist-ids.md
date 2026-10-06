# 02: Backend: `shortlistIds` on Place properties

**What to build:** `filteredPlaces` and `neighborhoodShortlists` tell for each Place which Shortlists' Amenities it has, so cards can show Amenity icons without the frontend knowing Google's spellings. Backend only, in `../coffemap-server`. Spec: [Neighborhood page redesign](../spec.md), "Backend: shortlistIds on Place properties".

**Before the first edit in `../coffemap-server`:** ask the owner whether to make this change in the current session or hand it to a separate backend session (CLAUDE.md, Backend). If handed off, write it as a ready-for-agent ticket in the backend's tracker.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `PlaceProperties` gains `shortlistIds: [ShortlistId!]!`: every Shortlist whose Amenities the Place has, each through its synonyms; the 4.0 Average rating threshold does not apply
- [ ] Order follows the server's Shortlist order; a Place with none returns `[]`; other queries return `[]`, never null
- [ ] It reuses the existing Shortlist definitions and Amenity synonym table, no second copy of the rule; raw `additionalInfo` stays out of these responses
- [ ] Resolver tests (`filteredPlaces`, `neighborhoodShortlists`, throwaway mongod): a synonym spelling counts (only "Free Wi-Fi" + laptop → `work`); Work is missing with one of its two Amenities; a Place below 4.0 still gets its ids; none → `[]`; server order
- [ ] The local server is rebuilt and a query against it shows `shortlistIds` for Places of one Neighborhood
