# 01: Full list and Not found on the Neighborhood page

**What to build:** The Neighborhood page keeps Top rated (Average rating ≥ 4.5) and adds "All N Places in {Neighborhood}": every visible Place, best Average rating first, Places without a Rating last and marked "No ratings yet — be the first". An unknown Neighborhood shows the Not found page instead of jumping to the map after two seconds. Frontend only: `filteredPlaces` without `minRating` already returns every Place. Spec: [Shortlists on the Neighborhood page](../spec.md), Frontend: Neighborhood page, Analytics.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] Sections live in the page's own `components/` (pages-first); the page runs `filteredPlaces` twice: `minRating: 4.5` for Top rated, none for the full list
- [x] Top rated is left out when empty; the `<h1>` and title stay "Best Coffee Places in {Neighborhood}"; the subtitle no longer says "rating of 4.5 or higher"
- [x] The full list sorts by Average rating; Places with a Rating count of 0 go last with "No ratings yet — be the first"; it shows 20 at first and "Show 20 more" reveals the next 20
- [x] A full list with a total of 0, or no `:neighborhood` param, renders the existing Not found page; the 2-second redirect to `/` is gone
- [x] `neighborhood_view` once per page view after the data loads (`neighborhood`, `shortlists_shown: 0` for now, `places_total`); `neighborhood_card_click` when a card opens the Place page (`neighborhood`, `section`: `top_rated` / `all`); both via `trackEvent` with `actor`
- [x] A new page test (`MockedProvider` + `MemoryRouter`, `trackEvent` mocked) covers the sections, the empty Top rated, unrated Places last, "Show 20 more", Not found without redirect, and both events
- [x] Checked in the browser through Chrome DevTools MCP at 375×812 on a large (Mitte) and a small (Spandau) Neighborhood and an unknown slug
