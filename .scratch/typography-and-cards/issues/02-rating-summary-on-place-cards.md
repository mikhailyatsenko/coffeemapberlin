# 02: Show the Average rating with its count on MainPage Place cards

**What to build:** Each Place card in MainPage's list now shows its rating the way NeighborhoodPage cards do. That means the coffee beans, the Average rating to one decimal ("4.0", "4.8") and how many Ratings it comes from ("(5 ratings)", "(1 rating)"). An unrated Place reads "No ratings yet — be the first". The list, the Favorites view, search results and filtered results all show this row. One shared presentational component renders the row on both kinds of card. NeighborhoodPage cards switch to it too, so their count now says "ratings" instead of "reviews". PlacePage's rating block is unchanged. No backend change: `ratingCount` already exists on every Place. See [spec](../spec.md), Implementation Decisions (Rating on MainPage cards) and Testing Decisions.

**Blocked by:** 01 (Give the site a font-weight scale), so the new and changed stylesheets are written on the weight tokens.

**Status:** ready-for-agent

- [ ] A new `RatingSummary` in `shared/ui` takes `averageRating`, `ratingCount` and an optional `size: 'small' | 'medium'` (default `medium`; it only changes sizing). It is exported by name and has no data imports.
- [ ] When `ratingCount > 0` it shows the display-only beans, the Average rating via `toFixed(1)` at medium weight, and "(N ratings)" / "(1 rating)" in a muted color at regular weight. When `ratingCount` is 0 it shows only "No ratings yet — be the first" in a muted color at regular weight.
- [ ] `NeighborhoodPlaceCard` renders its rating row through `RatingSummary`. Its props and public API stay the same.
- [ ] `PlaceCard` renders `RatingSummary size="small"` in place of the beans and bare number. On a 390px-wide screen a rated Place's row stays on one line and the card keeps its height.
- [ ] The `GetPlaces` query selects `ratingCount`, and the generated code is updated with `npm run codegen`. Fixtures typed as `GetPlaces` Places gain the field, and `MainPage.test.tsx` passes otherwise unchanged.
- [ ] A `RatingSummary` RTL test covers: "4.8" with "(5 ratings)"; a whole Average rating shown as "4.0"; "(1 rating)"; zero Ratings showing the no-ratings line and no number; no focusable element and no radio role.
- [ ] The `NeighborhoodPlaceCard.test.tsx` expectations change to "(1 rating)" / "(3 ratings)" and pass.
- [ ] A new `PlaceCard.test.tsx` (`MemoryRouter`, `AddToFavButton` mocked) checks that a rated Place shows its number and "(N ratings)" and that an unrated Place shows "No ratings yet — be the first".
- [ ] Browser check at 1440×900 and 390×844 against the prod API: the MainPage list, Favorites view and filtered results show the new row. NeighborhoodPage cards look as before apart from "ratings". The map popup and PlacePage are unchanged.
- [ ] `npm test`, `npm run lint:ts`, the type check and stylelint on the committed stylesheets pass.
