# 06: Neighborhood header with numbers and "Open on the map"

**What to build:** Under "Best Coffee Places in {Neighborhood}", the header says how big the Neighborhood is ("72 Places · 41 rated 4.5+") and offers "Open on the map", which opens the map filtered by the Neighborhood only. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: data", "See all and Open on the map", "Analytics".

**Blocked by:** 03 (Top rated and Shortlists as shelves of compact cards)

**Status:** ready-for-agent

- [ ] The title and `<title>` are unchanged; the old subtitle is replaced by the numbers line, from the full list's `total` and the Top rated count (before the cut to 6); singular forms read right ("1 Place")
- [ ] "Open on the map" sets the Filters to the Neighborhood only (no Amenities, no minimum Rating), clears Search, turns off Favorites, navigates to the map and sends `neighborhood_map_open` with `neighborhood`, `places_total`, `actor`
- [ ] Page tests cover the numbers, the link's Filters and navigation, and the event
- [ ] Checked in the browser through Chrome DevTools MCP: the map after "Open on the map" shows the Neighborhood's N Places
