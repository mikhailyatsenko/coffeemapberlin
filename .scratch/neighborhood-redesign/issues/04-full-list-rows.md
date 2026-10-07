# 04: The full list as rows with Rate it

**What to build:** "All N Places" becomes a dense list of rows where locals rate: a small photo, the name, the Average rating or "No ratings yet — be the first", the street, Favorite, and the one-tap beans right in the row. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: cards".

**Blocked by:** 03 (Top rated and Shortlists as shelves of compact cards)

**Status:** done

- [x] A new presentational row component in the same entity slice as the shelf card, with a contribution slot the page fills with `CardContribution`; not a variant flag on the shelf card
- [x] The row uses the shelf card's short-address rule; only the name and photo open the Place page; Favorite works as on cards
- [x] Beans sit beside the name on desktop and under it on a phone
- [x] Sorting, unrated last, "Show 20 more" and "Suggest it" are unchanged; `neighborhood_card_click` from a row sends `section: 'all'`
- [x] The page's old generic section of large cards is gone
- [x] The page's rating tests move from cards to rows: a tap on a row's beans sends `addRating`, shows "Your rating: N · change", doesn't navigate; a failure puts the beans back with the message
- [x] Checked in the browser through Chrome DevTools MCP at 1280px and 375×812: rows fit, beans are tappable, rating a row works against the local backend

## Comments

**2026-10-06, done.**
- The row is `entities/NeighborhoodPlaceCard/ui/NeighborhoodPlaceRow` (exported beside the card), with a `contribution` slot; `AllPlaces` renders the section itself and fills the slot with `CardContribution` (`section="all"`). `ListPlaceCard` and `PlacesSection` are deleted.
- Layout: a grid of photo · info · beans · Favorite on desktop; at 768px and below the beans drop to their own line under the info block.
- Page tests: a new rows test (name, Average rating or "No ratings yet", short address, no badge, no description); the rating tests now target rows.
- Browser (Chrome DevTools MCP, local backend): at 1280px rows are 1020px wide and 104px high with beans in the same row; at 375×812 rows fit with no horizontal scroll and the beans sit under the name; tapping 4 beans on Steel Bean saved through the backend (200), showed "Your rating: 4 · change" and stayed on the page.
- Review notes, not acted on: the row and the card repeat the photo link, title and Favorite markup (two different layouts, left as is); the slice is still named `NeighborhoodPlaceCard` though it now holds a row too, and the spec placed the row there.
