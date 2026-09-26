# 03: Four Shortlists on the Neighborhood page

**What to build:** Between Top rated and the full list, the page shows the Shortlists Work, Dog friendly, Outdoor seating and Breakfast & brunch. A Place makes a Shortlist when it has all the Shortlist's Amenities (through synonyms) and an Average rating of at least 4.0. Each Shortlist shows its top 5 and has an anchor; one with fewer than 3 Places is hidden in that Neighborhood. Backend in `../coffemap-server`, frontend here. Spec: [Shortlists on the Neighborhood page](../spec.md), Shortlist definitions, Backend: new query `neighborhoodShortlists`, Frontend: Neighborhood page.

**Blocked by:** 01 (Full list and Not found), 02 (Amenity synonyms in `filteredPlaces`)

**Status:** resolved

- [x] Backend: the Shortlist definitions module next to the synonym table (ids, order, Amenities, as in the spec's table)
- [x] Backend: `neighborhoodShortlists(neighborhood: String!): [Shortlist!]!` with the spec's schema (`id`, `amenities`, `places`, `total`); all four always returned; top 5 by Average rating, then Rating count, then name; it reuses the `filteredPlaces` aggregation and shares the Neighborhood normalization; an unknown Neighborhood returns four empty Shortlists
- [x] Backend resolver tests: all-Amenities rule, 4.0 threshold, order and top 5, `total`, synonym spellings, hidden Places and other Neighborhoods left out, slug normalized, unknown Neighborhood
- [x] Frontend: codegen run; the page holds each id's title, anchor and card question in one constant; a Shortlist with `total` under 3 is hidden (one frontend constant)
- [x] Each Shortlist block is a `<section>` whose `id` is its anchor (`work`, `dog-friendly`, `outdoor-seating`, `breakfast-brunch`); the page scrolls to the hash once the Shortlists have loaded
- [x] `shortlist_view` when a block first enters the viewport, once per page view (`neighborhood`, `shortlist`); `neighborhood_view` now carries the real `shortlists_shown`; `neighborhood_card_click` carries the Shortlist id as `section`
- [x] Page tests (`IntersectionObserver` mocked) cover the order of sections, hiding under 3, anchor ids and the events
- [x] Checked in the browser through Chrome DevTools MCP at 375×812: opening `/neighborhood/mitte#dog-friendly` lands on that Shortlist; Spandau shows no Shortlists

**Resolved (2026-09-26):** backend commit `74da6c5` in `coffemap-server` (Shortlist definitions in `src/amenities/shortlists.ts`, `neighborhoodShortlists`, 10 resolver tests). Frontend: `ShortlistBlock` sections between Top rated and the full list, `SHORTLISTS` + `SHORTLIST_MIN_PLACES` in the page's constants, hash scroll once the page data has loaded, `scroll-margin-top` so the title lands below the fixed navbar. A failing Shortlists query leaves the Shortlists out instead of failing the page. Browser check at 375×812: `/neighborhood/mitte#dog-friendly` lands with the "Dog friendly" title right below the navbar; all four Shortlists show in Mitte. Spandau does show one Shortlist: Breakfast & brunch has exactly 3 Places there since Breakfast and Brunch were merged as synonyms (ticket 02), so the "Spandau shows no Shortlists" expectation predates the synonyms; the rule holds (Work 0, Dog friendly 1, Outdoor seating 2 hidden). Marzahn-Hellersdorf (max 2) shows no Shortlists.

## Comments

- 2026-09-26: the backend part (Shortlist definitions, `neighborhoodShortlists`, resolver tests) is handed to a separate backend session as `../coffemap-server/.scratch/neighborhood-shortlists/issues/01-neighborhood-shortlists-query.md`. The frontend part starts once that ticket is done: run codegen against the new schema first.
