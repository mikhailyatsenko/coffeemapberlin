# 04: "See all N on the map"

**What to build:** Under each Shortlist, "See all N on the map" opens the map already filtered by the Neighborhood, the Shortlist's Amenities and a 4+ Rating, and the map shows those N Places. Frontend only. Spec: [Shortlists on the Neighborhood page](../spec.md), "See all N on the map", Analytics.

**Blocked by:** 03 (Four Shortlists on the Neighborhood page)

**Status:** ready-for-agent

- [ ] The link sets the Filters store (Neighborhood, the Shortlist's `amenities` as selected tags, minimum Rating 4) and navigates to the map; Filters stay out of the URL
- [ ] The map page, when it opens with Filters already active, fetches the filtered Places at once; the Filter panel shows them selected and Reset clears them as usual
- [ ] `shortlist_map_click` with `neighborhood`, `shortlist`, `count` and `actor`
- [ ] Tests cover the link setting the store and navigating, the map fetching on arrival with active Filters (and not without them), and the event
- [ ] Checked in the browser through Chrome DevTools MCP with the local backend: for two Shortlists, the number of Places on the map after "See all" equals N
