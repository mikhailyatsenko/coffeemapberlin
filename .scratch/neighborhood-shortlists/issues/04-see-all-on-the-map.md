# 04: "See all N on the map"

**What to build:** Under each Shortlist, "See all N on the map" opens the map already filtered by the Neighborhood, the Shortlist's Amenities and a 4+ Rating, and the map shows those N Places. Frontend only. Spec: [Shortlists on the Neighborhood page](../spec.md), "See all N on the map", Analytics.

**Blocked by:** 03 (Four Shortlists on the Neighborhood page)

**Status:** resolved

- [x] The link sets the Filters store (Neighborhood, the Shortlist's `amenities` as selected tags, minimum Rating 4) and navigates to the map; Filters stay out of the URL
- [x] The map page, when it opens with Filters already active, fetches the filtered Places at once; the Filter panel shows them selected and Reset clears them as usual
- [x] `shortlist_map_click` with `neighborhood`, `shortlist`, `count` and `actor`
- [x] Tests cover the link setting the store and navigating, the map fetching on arrival with active Filters (and not without them), and the event
- [x] Checked in the browser through Chrome DevTools MCP with the local backend: for two Shortlists, the number of Places on the map after "See all" equals N

**Resolved (2026-09-26):** frontend only. `ShortlistBlock` has a "See all N on the map" link; it sets the Filters (the Neighborhood's name from the Places, the Shortlist's `amenities`, minimum Rating 4 as `SHORTLIST_MIN_RATING`) through the new `setFilters` action, clears Search and turns off the Favorites view, since either would narrow the map below N. `MainPage` applies the Filters it opens with once per mount (`useApplyFiltersOnArrival`) and drops `filteredPlaces` left from an earlier visit first, so the previous Shortlist's Places don't show while the new ones load. Browser check with the local backend rebuilt from `main`: Mitte, Work 31 → 31 Places on the map, Dog friendly 40 → 40, then Work again (Apollo cache hit) 31 → 31; the Filter panel shows Mitte, 4+, "Good for working on laptop" and "Wi-Fi" selected; Reset brings back all 403.
