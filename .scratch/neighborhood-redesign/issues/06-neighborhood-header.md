# 06: Neighborhood header with numbers and "Open on the map"

**What to build:** Under "Best Coffee Places in {Neighborhood}", the header says how big the Neighborhood is ("72 Places · 41 rated 4.5+") and offers "Open on the map", which opens the map filtered by the Neighborhood only. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: data", "See all and Open on the map", "Analytics".

**Blocked by:** 03 (Top rated and Shortlists as shelves of compact cards)

**Status:** done

- [x] The title and `<title>` are unchanged; the old subtitle is replaced by the numbers line, from the full list's `total` and the Top rated count (before the cut to 6); singular forms read right ("1 Place")
- [x] "Open on the map" sets the Filters to the Neighborhood only (no Amenities, no minimum Rating), clears Search, turns off Favorites, navigates to the map and sends `neighborhood_map_open` with `neighborhood`, `places_total`, `actor`
- [x] Page tests cover the numbers, the link's Filters and navigation, and the event
- [x] Checked in the browser through Chrome DevTools MCP: the map after "Open on the map" shows the Neighborhood's N Places

## Comments

**2026-10-06, done.**
- The header is `pages/NeighborhoodPage/components/NeighborhoodHeader`: the unchanged h1, the numbers line (`lib/formatNeighborhoodNumbers.ts`) and "Open on the map", which calls `showNeighborhoodOnMap(neighborhood)` itself, like the shelves. The page passes `numbers` only once loaded, so while loading and on error the header is the title alone (ticket 08's skeleton takes over loading).
- Not in the spec, decided here: with no Place rated 4.5+, the line reads "N Places" without "· 0 rated 4.5+". A page test covers it.
- `neighborhood_map_open` goes through `useNeighborhoodAnalytics` (`trackNeighborhoodMapOpen`), with `places_total` from the full list's `total`.
- Browser (Chrome DevTools MCP, local backend, Friedrichshain-Kreuzberg): the header reads "72 Places · 41 rated 4.5+"; "Open on the map" opens the map with one Filter (the Neighborhood) and 72 Places in the list.
- Review notes, not acted on: `.mapLink` in the header repeats Shelf's `.seeAllLink` styles (two components of the same page; a shared page-level style would be the fix if a third appears).
