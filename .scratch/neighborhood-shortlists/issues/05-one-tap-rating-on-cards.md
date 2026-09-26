# 05: One-tap Rating on every card

**What to build:** Every card on the Neighborhood page offers "Been here? Rate it" with the one-tap Rating from the Place page: a tap saves at once, shows "Your rating: N · change", and a failure puts the beans back with the reason. A Rating given on one card shows on every card of that Place on the page, and a returning visitor sees their earlier Ratings. Backend in `../coffemap-server`, frontend here. Spec: [Shortlists on the Neighborhood page](../spec.md), Own Review on Place properties, Frontend: cards, Analytics.

**Blocked by:** 03 (Four Shortlists on the Neighborhood page)

**Status:** resolved

- [x] Backend: `PlaceProperties` gains `ownRating: Int` and `ownCharacteristics: [Characteristic!]`, filled from the person's own Review (User or Guest) by `filteredPlaces` and `neighborhoodShortlists`, null elsewhere; resolver tests for a User, a Guest and someone else
- [x] `NeighborhoodPlaceCard` stays presentational and gains a slot under its Rating; its `memo` comparison lets the slot's changes through; only its title and photo open the Place page, and taps in the slot don't bubble
- [x] `RateNow` exports a new public card contribution component that takes the Place id, own Rating and own Characteristics, and reuses `OneTapRating` as is; the page fills every card's slot with it
- [x] After a confirmed Rating it writes `ownRating` into the cached `PlaceProperties` of that Place, so every card of it updates; cards don't reorder and their Average rating doesn't change in the page view
- [x] Guest flow per ADR 0001; no "Create account" modal
- [x] `rating_saved` and `contribution_failed` gain `surface` (`neighborhood_card` on cards, `place_page` in the Place page block) and, on cards, `section`; `RateBlock` and `OneTapRating` tests updated only for `surface`
- [x] Page tests cover: a tap sends `addRating` with Guest credentials, shows "Your rating: N", doesn't navigate, updates every card of the Place; a failure reverts with the message; a returning Rating shows on load; events with `surface` and `section`
- [x] Checked in the browser through Chrome DevTools MCP at 375×812: card layout with the beans, rating a Place that appears in two sections

**Resolved (2026-09-26):** backend `bdcb3eb` in `../coffemap-server`, frontend in the commit that closes this ticket.
- `CardContribution` takes the Place id, own Rating and section; `ownCharacteristics` moves to 06, which is the first to use it.
- On cards, `useOneTapRating` evicts the Place page's cached `place` / `placeReviews` instead of refetching them: `PlaceProperties` is normalized by `id`, so a refetch would put the new Average rating on the cards in this page view. The Place page loads fresh on the next visit.
- The entity card's `memo` is gone: the slot is a new element on every render, so no comparison could skip one.
- Browser check at 375×812 ran with `CreateGuestIdentity` and `AddRating` stubbed in the page (the local server writes to the Atlas database); reads were real. A returning Rating after reload is covered by the page and resolver tests, not seen in the browser.
