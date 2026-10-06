Status: ready-for-agent

# Spec: Neighborhood page redesign

Builds on: [Shortlists on the Neighborhood page](../neighborhood-shortlists/spec.md) (released 2026-09-26), which this spec supersedes in part (see Further Notes). Decisions come from a grilling session with the owner on 2026-10-06.

## Problem Statement

The Neighborhood page (`/neighborhood/:slug`) is where search traffic for "coffee in Kreuzberg" lands, and it answers badly.

- **The Shortlists are out of sight.** Top rated lists every Place with an Average rating of 4.5 or higher: 41 large cards in Friedrichshain-Kreuzberg. On a phone, the first Shortlist (Work) starts after about 27 screens of scrolling, so almost nobody sees Work, Dog friendly, Outdoor seating or Breakfast & brunch, which are the reason the page exists.
- **The same Place shows up again and again** in large cards (Top rated, then a Shortlist, then the full list), so the page feels longer and more monotonous than it is.
- **Cards spend their space on the wrong things.** Every card carries a badge with the Neighborhood's name on a page that is about that Neighborhood. "Been here? Rate it" with five grey beans takes a third of each card and competes with the real Average rating. Descriptions exist on some Places only, so card heights jump.
- **A card can't say why a Place is in a Shortlist.** Shortlists are built from Amenities, but the card shows none of them; the query doesn't even fetch them.
- **The header says nothing about the Neighborhood:** a title and a subtitle that describes the page's layout. No size, no way to jump to a Shortlist, no way to the map.

## Solution

The page becomes a quick place to choose a Place, with contribution moved into the full list.

Top to bottom:

1. **Header:** "Best Coffee Places in {Neighborhood}" (unchanged, for search), a line with the Neighborhood's numbers ("72 Places · 41 rated 4.5+"), and "Open on the map", which opens the map filtered by the Neighborhood.
2. **Section switcher:** a row of buttons (Top rated · Work 18 · Dog friendly 9 · Outdoor seating · Breakfast & brunch · All 72). A tap scrolls to the section. The row sticks under the navbar while scrolling and highlights the section in view. On a phone it scrolls sideways. It lists only the sections on the page and is left out when the page has fewer than two.
3. **Top rated:** the 6 best Places with an Average rating of 4.5 or higher, and "See all N on the map".
4. **Four Shortlists,** as today (server order, top 5, hidden under 3 Places, "See all N on the map").
5. **All N Places:** a dense list of rows, best Average rating first, unrated last, "Show 20 more", "Suggest it".

Top rated and the Shortlists are **shelves** of compact cards: photo, name, Average rating, Favorite, Amenity icons, street. On desktop Top rated is a 3×2 grid and each Shortlist a row of 5, with nothing hidden. On a phone every shelf is a horizontal carousel. Shelf cards have no "Rate it".

Every card and row shows icons for the Shortlist Amenities the Place has (Work, Dog friendly, Outdoor seating, Breakfast & brunch), so a person sees at a glance that a Place is good for both work and the dog.

The full list's rows are where people rate: a small photo, the name, the Average rating or "No ratings yet — be the first", the Amenity icons, the street, and the one-tap beans right in the row.

The Characteristic question on Shortlist cards ("Free Wi-Fi? Yes / Skip") is removed.

While loading, the page shows a skeleton of the header and two shelves instead of a spinner.

## User Stories

1. As a visitor from search for "coffee Kreuzberg", I want the page title to still read "Best Coffee Places in Friedrichshain-Kreuzberg", so that the page answers what I searched for.
2. As a visitor, I want to see at the top how many Places the Neighborhood has and how many are rated 4.5 or higher, so that I know how much there is to choose from.
3. As a visitor, I want "Open on the map" in the header, so that I can see where the Neighborhood's Places are.
4. As a visitor who taps "Open on the map", I want the map to open filtered by this Neighborhood only, with no Search or Favorites on top, so that I see exactly this Neighborhood's Places.
5. As a visitor, I want a row of buttons for the page's sections right under the header, so that I see at once that there are lists for work, dogs, sitting outside and breakfast.
6. As a visitor, I want each Shortlist's button to show how many Places it has, so that I can tell which Neighborhood is good for what.
7. As a visitor, I want a tap on a section button to scroll me to that section, so that I don't have to scroll there myself.
8. As a visitor deep in the full list, I want the section buttons to stay visible under the navbar, so that I can jump back to Dog friendly with one tap.
9. As a visitor, I want the button of the section I'm reading highlighted, so that I know where I am on a long page.
10. As a phone user, I want the section buttons to scroll sideways when they don't fit, so that every section is reachable.
11. As a visitor, I want no button for a Shortlist that is hidden in this Neighborhood, so that no button leads nowhere.
12. As a visitor in a small Neighborhood with only the full list, I want no section buttons at all, so that the page doesn't show navigation with one item.
13. As a visitor with a shared link to `#dog-friendly`, I want to land on Dog friendly with its title visible below the navbar and the section buttons, so that old links keep working.
14. As a visitor, I want Top rated to show the 6 best Places, so that I get a short answer and reach the Shortlists quickly.
15. As a visitor, I want "See all N on the map" under Top rated, so that I can see every Place rated 4.5 or higher and where it is.
16. As a visitor who taps it, I want the map filtered by the Neighborhood and a minimum rating of 4.5, so that I see the same N Places.
17. As a visitor, I want each Shortlist to keep its top 5 and "See all N on the map", so that nothing I used before is gone.
18. As a visitor, I want a Place that is both top rated and in a Shortlist to appear in both, so that each list is complete on its own.
19. As a phone user, I want each shelf to be one horizontal carousel I can swipe, so that four Shortlists don't turn into twenty cards in a row.
20. As a phone user, I want to see the edge of the next card in a carousel, so that I know I can swipe.
21. As a desktop user, I want Top rated as a 3×2 grid and each Shortlist as a row of 5 with nothing hidden, so that I don't have to scroll sideways with a mouse.
22. As a visitor, I want a shelf card to show the photo, the name, the Average rating with its Rating count, and the street, so that I can choose by the look and the rating.
23. As a visitor, I want shelf cards of the same height, so that the shelves look tidy.
24. As a visitor, I want no Neighborhood badge on the cards, so that the card doesn't repeat what the page title says.
25. As a visitor, I want the street with its number but without the postcode, so that the card stays short.
26. As a visitor, I want icons for Work, Dog friendly, Outdoor seating and Breakfast & brunch on every card and row whose Place has those Amenities, so that I see why a Place fits and what else it offers.
27. As a visitor, I want the icons to mean the same on every section of the page, so that I learn them once.
28. As a screen-reader user, I want each icon to have a text name, so that I know what it stands for.
29. As a visitor, I want a Place with "Free Wi-Fi" and one with "Wi-Fi" to get the same icon, so that Google's spellings don't decide what I see.
30. As a visitor, I want the Work icon only when a Place has both Amenities of the Work Shortlist, so that the icon means the same as the list.
31. As a visitor, I want a Place below a 4.0 rating to still show its icons, so that the icons say what a Place has, not whether it made a Shortlist.
32. As a visitor, I want to save a Place to my Favorites from a shelf card and a row, as today, so that I don't lose that.
33. As a visitor, I want a tap on a card's name or photo to open the Place page, as today, so that I can read more.
34. As a visitor choosing a Place, I want no "Rate it" on shelf cards, so that the shelves are about choosing.
35. As a local, I want the full list to be where I rate, with the beans right in each row, so that I can rate the Places I know in one tap each.
36. As a local, I want a row of a Place I already rated to show "Your rating: N · change", as cards do today, so that I can correct it.
37. As a visitor, I want a row to show the Average rating and its count, or "No ratings yet — be the first", so that I can tell unrated Places from bad ones.
38. As a visitor, I want the full list sorted by Average rating with unrated Places last, 20 at a time with "Show 20 more", as today, so that the list stays quick.
39. As a phone user, I want a row's beans under the name instead of beside it, so that the row fits the screen.
40. As a visitor, I want "Know a Place that's missing? Suggest it" under the full list, as today.
41. As a visitor who has rated a Place, I want no follow-up question about a Characteristic on the page, so that the page doesn't turn into a survey.
42. As a visitor on a slow connection, I want to see the page's shape (header and shelves in grey) while it loads, so that the page doesn't jump when the data arrives.
43. As a visitor following a link to a Neighborhood that doesn't exist, I want the Not found page, as today.
44. As a visitor, I want the page to still list every Place when the Shortlists fail to load, as today.
45. As a keyboard user, I want to reach the section buttons, the cards, Favorite, "See all", the beans and "Show 20 more" with Tab and use them with Enter or Space, so that I can use the page without a mouse.
46. As a keyboard user, I want a carousel's cards to be reachable with Tab and scrolled into view when focused, so that no card is hidden from me.
47. As the owner, I want to know whether people use the section buttons, so that I can tell whether the new navigation works.
48. As the owner, I want "See all" under Top rated counted with the Shortlists' "See all", so that all map visits from shelves are in one report.
49. As the owner, I want "Open on the map" in the header counted, so that I can see whether the header leads people to the map.
50. As the owner, I want every event the page sends today to keep its name and params, so that the reports before and after the redesign line up.
51. As a developer building the Quiz later, I want the Shortlist Amenities of a Place to come from the server, so that the synonym table stays in one place.

## Implementation Decisions

**Backend: `shortlistIds` on Place properties** (`../coffemap-server`)

- `PlaceProperties` gains `shortlistIds: [ShortlistId!]!`: the Shortlists whose Amenities the Place has, all of them, each through its synonyms. The Average rating threshold of 4.0 does not apply: the field says what a Place has, not whether it made the Shortlist.
- Order follows the server's Shortlist order. A Place with none returns an empty list.
- It reuses the Shortlist definitions and the Amenity synonym table that `neighborhoodShortlists` and `filteredPlaces` already use; there is no second copy of the rule.
- `filteredPlaces` and `neighborhoodShortlists` fill it. Other queries may leave it empty: the field is non-null, so they return `[]`, never null, until a page needs them.
- The raw `additionalInfo` stays out of these responses.

**Frontend: data**

- The `FilteredPlaces` and `NeighborhoodShortlists` documents request `shortlistIds`; codegen updates.
- The page keeps its three queries. Top rated is still sorted on the client and now cut to the first 6; its total (for the header and "See all") is the length of the Top rated result before the cut.
- Header numbers come from the loaded data: the full list's `total` and the Top rated count. No new query, no Neighborhood average rating.
- The section switcher's numbers come from each Shortlist's `total`, the Top rated count and the full list's `total`.

**Frontend: page structure** (`pages/NeighborhoodPage`, pages-first)

- New page components: the header with numbers and "Open on the map", the section switcher, a shelf (the titled grid/carousel of shelf cards with "See all N on the map" under it), and the full-list section of rows. Top rated and each Shortlist block render through the shelf; the existing generic section that renders large cards goes away.
- Section ids (anchors) stay as they are: `top-rated`, `work`, `dog-friendly`, `outdoor-seating`, `breakfast-brunch`, `all-places`. The switcher links to them.
- The switcher is left out when fewer than two sections are on the page. It sticks under the navbar. The section in view is tracked with `IntersectionObserver`. A tap scrolls smoothly to the section and moves focus there. The sections' scroll margin grows by the switcher's height, so hash links and switcher taps land the title below both bars.
- The old subtitle ("The top rated Places first, then every Place on the map") goes; the numbers line replaces it.
- The page container widens to the site's container width so a row of 5 fits on desktop.
- Phone carousels use native horizontal scroll with snap points, cards a bit narrower than the screen so the next one peeks. No carousel library.
- The loading state is a skeleton (the header's lines and two shelves of grey cards) instead of the spinner. Error and Not found states stay.

**"See all" and "Open on the map"**

- The existing helper that sets the Filters store for a Shortlist (Neighborhood, Amenities, minimum Rating; Search cleared; Favorites off) generalizes to take optional Amenities and a minimum Rating. Top rated calls it with the Neighborhood and 4.5; the header calls it with the Neighborhood only. The map's "apply Filters on arrival" step from the Shortlists spec does the rest.

**Frontend: cards**

- The `NeighborhoodPlaceCard` entity (used only by this page) becomes the compact shelf card: photo, name, `RatingSummary`, Favorite, Amenity icons, short address. No Neighborhood badge, no description, no Instagram, no contribution slot.
- A new presentational row for the full list: small square photo, name, `RatingSummary` or "No ratings yet — be the first", Amenity icons, short address, Favorite, and a contribution slot that the page fills with `CardContribution`. It is a separate component, not a variant flag on the shelf card (architecture: no flag props for variants). It lives in the same entity slice as the shelf card, since both render a Place for a Neighborhood listing.
- Short address: the street and number, the postcode cut off. The rule is a pure function with its own small cases in the page test (addresses come from Google as "Street 38, 10997").
- Amenity icons: one small icon per `shortlistIds` entry, in server order, each with an accessible name ("Good for work", "Dog friendly", "Outdoor seating", "Breakfast & brunch") and a tooltip. The icon set and names live with the cards; the page's Shortlist display constants keep titles and anchors.
- Only the name and photo open the Place page, as today.

**Removing the Characteristic question**

- `CardContribution` drops its question: the `question` prop, its question hook and the question UI usage. It becomes "Been here? Rate it" + one-tap Rating + "Your rating: N · change".
- The page's Shortlist display constants drop the `question` field.
- `characteristic_answered` is no longer sent from cards; the Place page keeps its own questions unchanged.
- Anything in `RateNow` used only by the card question goes; components the Place page still uses stay.

**Analytics** (through `trackEvent`, each with `actor`)

| Event | When | Params |
|---|---|---|
| `neighborhood_view`, `shortlist_view`, `shortlist_map_click`, `neighborhood_card_click`, `rating_saved`, `contribution_failed` | unchanged | unchanged |
| `shortlist_map_click` | also "See all N on the map" under Top rated | `shortlist: 'top_rated'`, `neighborhood`, `count` |
| `neighborhood_nav_click` | a section switcher button tapped | `neighborhood`, `target` (`top_rated` / Shortlist id / `all`) |
| `neighborhood_map_open` | "Open on the map" in the header tapped | `neighborhood`, `places_total` |

- `shortlist_view` stays for the four Shortlists only.
- `neighborhood_card_click` keeps `section`; full-list rows send `all`.

## Testing Decisions

- Good tests drive the page or the resolvers the way a person or a client does and assert what is on screen, what reaches the network, what lands in the Filters store or what the query returns. They don't assert component state, hooks, cache internals, class names or aggregation stages.
- **Frontend seam: the Neighborhood page**, extending its existing test (`MockedProvider`, `MemoryRouter`, `trackEvent`, `ensureGuestIdentity` and `IntersectionObserver` mocked). Cover:
  - the header shows the Places total and the Top rated count; "Open on the map" sets the Filters to the Neighborhood only, clears Search and Favorites, navigates to the map and sends `neighborhood_map_open`;
  - the switcher lists Top rated, each shown Shortlist with its total and All with its total, in page order; a hidden Shortlist has no button; with fewer than two sections there is no switcher; a button points at its section's id and sends `neighborhood_nav_click` with its `target`;
  - Top rated shows at most 6 Places, best first; "See all N on the map" shows the full count, sets the Filters to the Neighborhood and 4.5 and sends `shortlist_map_click` with `shortlist: 'top_rated'`;
  - Shortlist blocks keep their order, anchors, hiding under 3 and "See all" behavior (existing tests stay);
  - cards and rows show an icon with its accessible name for each `shortlistIds` entry and none for an empty list; no card shows the Neighborhood badge; the short address drops the postcode;
  - shelf cards have no "Rate it"; full-list rows do, and a tap on a row's beans sends `addRating`, shows "Your rating: N" and doesn't navigate (existing rating tests move from cards to rows);
  - no Characteristic question appears anywhere after a Rating (the existing question tests are replaced by this one);
  - the skeleton shows while loading and the existing Not found, error and "Shortlists fail to load" tests stay green;
  - unchanged events keep their params.
- **Backend seam: the resolvers** against a throwaway mongod, extending `filteredPlaces.test.ts` and `neighborhoodShortlists.test.ts`. Cover:
  - `shortlistIds` lists a Shortlist when the Place has all its Amenities, through a synonym spelling too (only "Free Wi-Fi" + laptop → `work`);
  - Work is missing when only one of its two Amenities is there;
  - a Place rated below 4.0 still gets its `shortlistIds`;
  - a Place with none gets `[]`; the order is the server's Shortlist order.
- `RateBlock.test.tsx`, `OneTapRating.test.tsx` and the Place page's question tests stay green.
- **Checked in the browser, not in tests,** through Chrome DevTools MCP by the implementing agent, so no ticket needs a human: the switcher sticking under the navbar and highlighting the section in view; a hash link landing the title below both bars; carousels at 375×812 with the next card peeking; the 3×2 grid and the row of 5 at 1280px; the skeleton; tab focus scrolling a carousel card into view.

## Out of Scope

- A mini-map of the Neighborhood on the page ("Open on the map" covers it).
- Editorial descriptions of the 13 Neighborhoods.
- A Neighborhood average rating.
- Tabs that show one section at a time.
- Removing duplicates between Top rated and the Shortlists.
- Changing which Shortlists exist, their Amenities or their thresholds.
- Amenity icons beyond the four Shortlist ones, and `shortlistIds` on queries other than `filteredPlaces` and `neighborhoodShortlists`.
- The Place page's Rating block and Characteristic questions.
- Filters in the URL; own URLs per Shortlist.
- MainPage's `PlaceCard` and the map popup card.

## Further Notes

**Supersedes in part the Shortlists spec.** Rate it on every card (its stories 14 and 20 as far as they concern Top rated and Shortlist cards) and the Characteristic question on Shortlist cards (its stories 22–29) are withdrawn: shelves are for choosing, the full list is for contributing. Its eight-week success check is cancelled by the owner (2026-10-06); its analytics events stay.

**Why the full list holds the beans.** The Shortlists spec put the beans on every card to reach unrated Places; those Places sit in the full list anyway (unrated last), so the contribution stays where it has the most to do.

**Dependencies:** the Amenity synonym table and Shortlist definitions on the server; `RatingSummary` and the weight scale from Typography and cards; `CardContribution` and `OneTapRating` from One-tap contributions; the map applying Filters on arrival from the Shortlists spec.

**Backend work** goes to `../coffemap-server`; per CLAUDE.md, the implementing session asks the owner before the first edit there.
