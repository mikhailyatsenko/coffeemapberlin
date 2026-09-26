# 03: Four Shortlists on the Neighborhood page

**What to build:** Between Top rated and the full list, the page shows the Shortlists Work, Dog friendly, Outdoor seating and Breakfast & brunch. A Place makes a Shortlist when it has all the Shortlist's Amenities (through synonyms) and an Average rating of at least 4.0. Each Shortlist shows its top 5 and has an anchor; one with fewer than 3 Places is hidden in that Neighborhood. Backend in `../coffemap-server`, frontend here. Spec: [Shortlists on the Neighborhood page](../spec.md), Shortlist definitions, Backend: new query `neighborhoodShortlists`, Frontend: Neighborhood page.

**Blocked by:** 01 (Full list and Not found), 02 (Amenity synonyms in `filteredPlaces`)

**Status:** ready-for-agent

- [ ] Backend: the Shortlist definitions module next to the synonym table (ids, order, Amenities, as in the spec's table)
- [ ] Backend: `neighborhoodShortlists(neighborhood: String!): [Shortlist!]!` with the spec's schema (`id`, `amenities`, `places`, `total`); all four always returned; top 5 by Average rating, then Rating count, then name; it reuses the `filteredPlaces` aggregation and shares the Neighborhood normalization; an unknown Neighborhood returns four empty Shortlists
- [ ] Backend resolver tests: all-Amenities rule, 4.0 threshold, order and top 5, `total`, synonym spellings, hidden Places and other Neighborhoods left out, slug normalized, unknown Neighborhood
- [ ] Frontend: codegen run; the page holds each id's title, anchor and card question in one constant; a Shortlist with `total` under 3 is hidden (one frontend constant)
- [ ] Each Shortlist block is a `<section>` whose `id` is its anchor (`work`, `dog-friendly`, `outdoor-seating`, `breakfast-brunch`); the page scrolls to the hash once the Shortlists have loaded
- [ ] `shortlist_view` when a block first enters the viewport, once per page view (`neighborhood`, `shortlist`); `neighborhood_view` now carries the real `shortlists_shown`; `neighborhood_card_click` carries the Shortlist id as `section`
- [ ] Page tests (`IntersectionObserver` mocked) cover the order of sections, hiding under 3, anchor ids and the events
- [ ] Checked in the browser through Chrome DevTools MCP at 375×812: opening `/neighborhood/mitte#dog-friendly` lands on that Shortlist; Spandau shows no Shortlists
