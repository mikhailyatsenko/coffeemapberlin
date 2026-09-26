# Spec: Shortlists on the Neighborhood page

Status: ready-for-agent
Map: [Engagement: what to build so people interact more with the site](../engagement/map.md). Decision: [Which "best in Neighborhood" lists are worth showing?](../engagement/issues/06-best-in-neighborhood.md). Rank: #2 in [Rank the candidates into the final list](../engagement/issues/07-rank-candidates.md). Builds on: [One-tap contributions](../one-tap-contributions/spec.md) (in production since 2026-09-25) and [Photo without Review text](../photo-without-review-text/spec.md).

**Start gate overridden:** the One-tap contributions spec says to wait for its eight-week check (~2026-11-20) before building Shortlists. On 2026-09-26 the owner chose to build now. See Further Notes.

## Problem Statement

The Neighborhood page is the second page type that search traffic lands on, and today it lets nobody do anything but leave. It shows only Places with an Average rating of 4.5 or higher, so the Places that most need a first Rating are hidden. It answers only "what is rated highest", not the questions people search with: somewhere to work, somewhere to take the dog, somewhere to sit outside, somewhere for breakfast. Its cards show a Rating that can't be tapped, so a local who has been to half the Places on the page has no way to say so. An unknown Neighborhood in the URL shows an empty page for two seconds and then silently jumps to the map. And nobody can tell how the page is used: GA sees only the page view.

## Solution

The Neighborhood page becomes three sections, top to bottom:

1. **Top rated**: the current list (Average rating ≥ 4.5), kept for the search-facing title.
2. **Four Shortlists**, the same on every Neighborhood and in this order: Work, Dog friendly, Outdoor seating, Breakfast & brunch. A Place makes a Shortlist when it has all the Amenities of the Shortlist and an Average rating of at least 4.0. Each Shortlist shows its top 5 by Average rating and "See all N on the map", which opens the map with the matching Filters. A Shortlist with fewer than 3 Places is hidden in that Neighborhood. Each Shortlist has an anchor (`/neighborhood/mitte#dog-friendly`).
3. **"All N Places in Mitte"**: every visible Place, sorted by Average rating, with the Places that have no Rating last and marked "No ratings yet — be the first".

Every card on the page offers "Been here? Rate it" with the one-tap Rating from the Place page. On a Shortlist card, once the person has a Rating, the card also asks one Yes / Skip question about the Characteristic matching the Shortlist: Work → free Wi-Fi, Dog friendly → pet friendly, Outdoor seating → outdoor seating, Breakfast & brunch → yummy eats. Every answer goes into the visitor's one Review for the Place, as on the Place page, and a Rating given on one card shows on every card of that Place on the page.

On the server, Amenities that Google spells in several ways (Wi-Fi / Free Wi-Fi, Cozy / Cosy, the Dogs allowed variants) are merged through one synonym table. Both the Shortlists and the map's Filters use it, so "See all 12 on the map" shows 12.

An unknown Neighborhood shows the Not found page.

The feature ships with GA events, a baseline and a success threshold (see Further Notes).

## User Stories

1. As a visitor arriving from search for "coffee Mitte", I want the page to still open with the top rated Places, so that the page answers what I searched for.
2. As a visitor, I want to see "Work", "Dog friendly", "Outdoor seating" and "Breakfast & brunch" Shortlists for the Neighborhood, so that I find a Place for what I want to do.
3. As a visitor, I want each Shortlist to show at most five Places, best Average rating first, so that I get a short answer, not a directory.
4. As a visitor, I want "See all N on the map" under a Shortlist, so that I can see every matching Place and where it is.
5. As a visitor who taps "See all N on the map", I want the map to open already filtered by the Neighborhood, the Shortlist's Amenities and 4+ Rating, so that I don't have to set the Filters myself.
6. As a visitor, I want the map to show the same N Places the link promised, so that I trust the numbers.
7. As a visitor in a small Neighborhood, I want a Shortlist with fewer than three Places hidden, so that I don't see a "best of" list of one.
8. As a visitor in Spandau, Marzahn-Hellersdorf or Lichtenberg, I want the page to still list every Place, so that the page is useful even without Shortlists.
9. As a visitor, I want a link to a Shortlist (`#dog-friendly`) to scroll to it, so that a shared or bookmarked link lands on the right list.
10. As a visitor, I want "All N Places in Mitte" to list every Place in the Neighborhood, so that nothing is hidden because it has few Ratings.
11. As a visitor, I want Places without a Rating at the end of the full list, marked "No ratings yet — be the first", so that I know they are unrated, not bad.
12. As a visitor in a large Neighborhood, I want the full list to show 20 Places at first and "Show 20 more", so that the page stays quick to scroll.
13. As a visitor, I want a tap on a card's name or photo to open the Place page, as today, so that I can read more.
14. As a visitor who has been to a Place, I want "Been here? Rate it" with the beans on its card, so that I can rate it without leaving the list.
15. As a visitor, I want a tap on the beans to rate, not to open the Place page, so that rating doesn't navigate away.
16. As a Guest, I want my first tap on a card to work without signing up or a visible captcha, exactly as on the Place page, so that there is no barrier.
17. As a visitor, I want the card to confirm my Rating the moment I tap, so that I know it counted.
18. As a visitor, I want "Your rating: 4 · change" on the card after rating, so that I can correct it.
19. As a visitor whose Rating failed, I want the card to put the beans back and say why (reCAPTCHA blocked or connection), so that I don't believe it was saved.
20. As a visitor who rated a Place in a Shortlist, I want every other card of that Place on the page to show my Rating too, so that the page doesn't contradict itself.
21. As a returning visitor, I want cards of Places I've already rated to show "Your rating: N · change", so that I see what I gave before.
22. As a visitor who just rated a Place on the Dog friendly Shortlist, I want one question "Pet friendly?" with Yes / Skip, so that I can confirm what the list is about with one tap.
23. As a visitor on the Work Shortlist, I want to be asked "Free Wi-Fi?"; on Outdoor seating, "Outdoor seating?"; on Breakfast & brunch, "Yummy eats?", so that the question fits the list.
24. As a visitor, I want no question before I've rated, so that I'm not asked opinions about a Place I may not have visited.
25. As a visitor, I want no question on Top rated or full-list cards, so that the page doesn't turn into a survey.
26. As a visitor who has already marked that Characteristic, I want no question about it, so that I'm not asked twice and never un-mark it by accident.
27. As a visitor, I want "Yes" to mark the Characteristic in my Review and the question to go away on every card of that Place, so that my answer counts once.
28. As a visitor, I want "Skip" to hide the question on that card for this page view and store nothing, so that I'm never forced to judge.
29. As a visitor whose "Yes" failed, I want the question back with a message, so that I can try again.
30. As a visitor who wants to say more, I want the Place page to have the rest of the questions, the Review text and Photos, so that the card stays small.
31. As a Guest, I want no "Create account" modal after rating on a card, so that one-tap stays one tap.
32. As a keyboard user, I want to reach the beans, Yes / Skip, "See all" and "Show 20 more" with Tab and use them with Enter or Space, so that I can use the page without a mouse.
33. As a screen-reader user, I want the Rating confirmation and errors on a card announced, so that I know the result of a tap.
34. As a visitor who follows a link to a Neighborhood that doesn't exist, I want the Not found page, so that I'm not dropped on the map without a word.
35. As a visitor on a Neighborhood with no Place at 4.5 or higher, I want the Top rated section left out instead of an empty message, so that the page starts with something useful.
36. As a visitor using the map's Filters, I want "Dogs allowed" to also match Places Google lists under another spelling, so that the Filter doesn't miss Places.
37. As a Guest who later signs in, I want Ratings and Characteristics given on cards claimed like all my Reviews, so that nothing is lost.
38. As the owner, I want GA events for the page view, each Shortlist seen, "See all" taps, card opens, and Ratings and answers given on cards, so that I can see what the page is used for.
39. As the owner, I want Rating events to say whether they came from the Place page or a Neighborhood card, so that I can tell the two features apart during their overlapping checks.
40. As the owner, I want a written baseline and success threshold for eight weeks after release, so that I can decide whether to keep the Shortlists.
41. As a developer building Visits next, I want every card on the page to know the person's own Rating for its Place, so that "Been here" badges and "4 of 41 in Mitte" can be added without another query.
42. As a developer building the Quiz later, I want the Amenity synonym table on the server as one module, so that the Quiz reuses it instead of copying it.

## Implementation Decisions

**Shortlist definitions** (server-side, one module next to the synonym table)

| Id | Anchor | Title | Amenities (all required) | Card question |
|---|---|---|---|---|
| `work` | `#work` | Work | Good for working on laptop + Wi-Fi | free Wi-Fi |
| `dogFriendly` | `#dog-friendly` | Dog friendly | Dogs allowed | pet friendly |
| `outdoorSeating` | `#outdoor-seating` | Outdoor seating | Outdoor seating | outdoor seating |
| `breakfastBrunch` | `#breakfast-brunch` | Breakfast & brunch | Breakfast | yummy eats |

- The server owns the order, the Amenities and the qualifying rule. The frontend owns the title, the anchor and the card question for each id.
- Qualifying rule: all Amenities of the set (each one through its synonyms), a visible Place in the Neighborhood, Average rating ≥ 4.0. Sorted by Average rating, ties by Rating count, then by name. Top 5 returned, plus the total.
- The page hides a Shortlist whose total is under 3. The server returns all four regardless, so the rule lives in one place (a frontend constant) and the frontend tests cover it.
- Cozy and Great coffee are not Shortlists: ~80% of Places have them, so they tell nothing apart. Kids or Vegan can be added later as one row here.

**Amenity synonym table** (backend, new module, reused later by the Quiz)

- Maps one canonical Amenity name to every Google spelling of it: Wi-Fi ↔ Free Wi-Fi, Cozy ↔ Cosy, the Dogs allowed variants, Breakfast ↔ Brunch (Breakfast & brunch counts either), and any other pair found. The canonical name is the spelling on the most Places.
- Build it from the real names: list `availableAdditionalInfoTags` against production (read-only) and pick the synonyms from the ~148 names. Record the date checked in a comment.
- A name that is not in the table stands for itself.

**Backend: `filteredPlaces`** (`../coffemap-server`)

- Each requested Amenity is expanded through the synonym table: a Place matches an Amenity when it has any of its spellings. Amenities are still combined with AND. The response shape doesn't change. This is what makes "See all N on the map" show N; the map's Filter panel benefits too.
- Its Place properties gain the person's own Rating and own marked Characteristics (see below).

**Backend: new query `neighborhoodShortlists`**

```graphql
enum ShortlistId { work dogFriendly outdoorSeating breakfastBrunch }

type Shortlist {
  id: ShortlistId!
  "Canonical Amenity names, for the map's Filters."
  amenities: [String!]!
  "Top 5 by Average rating."
  places: [Place!]!
  "All Places that qualify."
  total: Int!
}

type Query {
  neighborhoodShortlists(neighborhood: String!): [Shortlist!]!
}
```

- It normalizes the Neighborhood the way `filteredPlaces` does (the slug `friedrichshain-kreuzberg` → `Friedrichshain-Kreuzberg`) and shares that code.
- It reuses the `filteredPlaces` aggregation (visibility, Average rating, Favorites, own Review) rather than a second copy. An unknown Neighborhood returns four empty Shortlists.

**Own Review on Place properties**

- `PlaceProperties` gains `ownRating: Int` (the person's Rating for the Place, or null) and `ownCharacteristics: [Characteristic!]` (the Characteristics they marked). Both come from the person's own Review, User or Guest (Guest via the identity headers). The `filteredPlaces` aggregation already finds that Review for `isFavorite`.
- `filteredPlaces` and `neighborhoodShortlists` fill them. Other queries leave them null. The Place page keeps using its own sources (Place reviews and `characteristicCounts.pressed`).
- This is also the Visit signal Visits (#3) needs on cards.

**Frontend: Neighborhood page** (`pages/NeighborhoodPage`)

- Three queries: `filteredPlaces` with `minRating: 4.5` (Top rated), `neighborhoodShortlists`, and `filteredPlaces` without `minRating` (All). Top rated is sorted on the client as today.
- Sections are the page's own `components/` (pages-first): Top rated, Shortlist block, full list. Each Shortlist block is a `<section>` with the anchor as its `id`. The page scrolls to the hash once the Shortlists have loaded, since they aren't in the DOM before that.
- Top rated is left out when it is empty. The full list shows the first 20 and "Show 20 more". Places with a Rating count of 0 go last and show "No ratings yet — be the first" instead of the beans' Average rating.
- Not found: when the full list returns a total of 0, the page renders the existing Not found page. The 2-second redirect to `/` goes away. A missing `:neighborhood` param renders Not found too.
- The page title and `<h1>` stay "Best Coffee Places in {Neighborhood}". The subtitle describes the page, no longer "rating of 4.5 or higher".

**"See all N on the map"**

- Sets the Filters store (Neighborhood, the Shortlist's `amenities` as selected tags, minimum Rating 4) and navigates to the map.
- The map page today applies Filters only from the panel's Apply button. It gains one step: when it opens with Filters already active, it fetches the filtered Places at once. The Filter panel shows them as selected and Reset clears them as usual.
- Filters stay out of the URL, as today.

**Frontend: cards**

- The `NeighborhoodPlaceCard` entity stays presentational: it gains a slot for a contribution area under the Rating. Its `memo` comparison must let the slot's changes through. Only the title and photo open the Place page; the slot's taps don't bubble to the card. The page fills the slot.
- The `RateNow` feature exports a new public **card contribution** component: "Been here? Rate it" + the one-tap Rating, and optionally one Characteristic question. It takes the Place id, the person's own Rating and marked Characteristics, and the Characteristic to ask (none on Top rated and full-list cards).
- It reuses `OneTapRating` as is and the Yes / Skip question UI from `CharacteristicQuestions`. It has no batching, no "More questions?", no "Your marks", no Photo button and no Review text link. Those stay on the Place page.
- Shared across cards of one Place: after a confirmed Rating or Yes, the component writes `ownRating` / `ownCharacteristics` into the cached `PlaceProperties` of that Place, so every card of it on the page updates. A failed Yes leaves the cache as it was. Skip is card-local state for the page view.
- Only-marks rule, as on the Place page: Yes is never sent for a Characteristic already in `ownCharacteristics`, since the toggle would un-mark it.
- The card's Average rating doesn't change after a Rating in this page view, and cards never reorder under the person's finger. The next load shows the new Average.
- Guest flow: unchanged from ADR 0001. No "Create account" modal after a card action.

**Analytics** (through `trackEvent`, each with `actor`; card events also carry `place_id`)

| Event | When | Extra params |
|---|---|---|
| `neighborhood_view` | the page's data has loaded, once per page view | `neighborhood`, `shortlists_shown` (count), `places_total` |
| `shortlist_view` | a Shortlist block first enters the viewport, once per page view | `neighborhood`, `shortlist` |
| `shortlist_map_click` | "See all N on the map" tapped | `neighborhood`, `shortlist`, `count` |
| `neighborhood_card_click` | a card opens the Place page | `neighborhood`, `section` (`top_rated` / Shortlist id / `all`) |
| `rating_saved`, `characteristic_answered`, `contribution_failed` | as on the Place page | plus `surface` (`place_page` / `neighborhood_card`) and, on cards, `section` |

- The existing one-tap events gain `surface: 'place_page'` on the Place page. The param is new, so older events without it count as the Place page.

## Testing Decisions

- Good tests drive the page or the resolvers the way a person or a client does and assert what is on screen, what reaches the network or what the query returns. They don't assert hooks, component state, cache internals or aggregation stages.
- **Backend seam: the resolvers** (`neighborhoodShortlistsResolver`, `filteredPlacesResolver`) against a throwaway mongod with seeded Places and Reviews. Prior art: `tests/uploadReviewImage.test.ts`. Cover:
  - a Place qualifies only with all Amenities of the set and Average rating ≥ 4.0; order by Average rating; at most 5 places; `total` counts all;
  - a synonym spelling qualifies (a Place with only "Free Wi-Fi" is in Work; one with only a Dogs allowed variant is in Dog friendly);
  - hidden (closed) Places and other Neighborhoods are left out; the slug is normalized; an unknown Neighborhood returns four empty Shortlists;
  - `filteredPlaces` with a canonical Amenity returns the same Places as the matching Shortlist's `total`;
  - `ownRating` and `ownCharacteristics` for a User, for a Guest, and null for someone else.
- **Frontend seam: the Neighborhood page**, rendered with `MockedProvider` and `MemoryRouter`, with `ensureGuestIdentity` and `trackEvent` mocked and `IntersectionObserver` mocked for the view events. Prior art: `RateBlock.test.tsx`, `OneTapRating.test.tsx`. Cover:
  - three sections in order; Top rated left out when empty; a Shortlist with a total under 3 hidden; each Shortlist block has its anchor id;
  - the full list puts unrated Places last with "No ratings yet — be the first", and "Show 20 more" reveals the next 20;
  - "See all N on the map" sets the Filters store and navigates to the map; the map fetches filtered Places when it opens with Filters active;
  - an empty full list renders Not found, with no redirect;
  - a tap on a card's beans sends `addRating` with Guest credentials, shows "Your rating: N", doesn't navigate, and updates every card of that Place; a failure puts the beans back with the message;
  - the Shortlist question appears only after a Rating, never when the Characteristic is already marked, never on Top rated or full-list cards; Yes sends `toggleCharacteristic` and removes the question from every card of the Place; Skip sends nothing; a failed Yes brings it back;
  - each event in the table fires once with the documented params, including `surface` and `section`.
- `RateBlock.test.tsx` and `OneTapRating.test.tsx` stay green, updated only for the new `surface` param.
- **Checked in the browser, not in tests:** scrolling to a hash on first load, the card layout at phone width (375×812), and the map showing exactly N Places after "See all". The implementing agent checks them through Chrome DevTools MCP, so no ticket needs a human.

## Out of Scope

- Own URLs per Shortlist and Neighborhood pages in the sitemap (standalone SEO, per the map).
- A "people say" Characteristic signal on Shortlists, and three-valued Characteristics.
- "Been here" badges and Visit progress on cards (Visits, #3). This spec only provides `ownRating`.
- Photos, Review text or more than one question on cards.
- Filters in the URL.
- Shortlists beyond the four, and per-Neighborhood Shortlist choice.
- Changing the Place page's Rating block beyond the new `surface` param.
- The Quiz, which later reuses the synonym table and the card contribution component.

## Further Notes

**Start gate overridden (2026-09-26).** The One-tap contributions spec says to stop and rethink before building Shortlists if Ratings are below 2× the baseline at its eight-week check (~2026-11-20). The owner chose to build now instead of waiting two months: Shortlists open contribution on another page, and `surface` keeps the two features' numbers apart. So the Shortlists check window overlaps the One-tap one. Judge One-tap on `surface: 'place_page'` Ratings from GA, alongside its database totals, which now include card Ratings.

**How success is measured**

- **Two sources.** The database is the ground truth for how many Ratings exist, but it can't tell where a Rating came from. GA can, through `surface`, but misses visitors with ad blockers. So the totals come from the database and the split from GA. Count creation time by the Review's `_id`, not `date`, which edits rewrite.
- **Baseline:**
  - Neighborhood page views over the eight weeks before release, from GA (`page_view` on `/neighborhood/*`), noted in this spec on release day.
  - Ratings from the Neighborhood page are 0 today: it allows none.
  - Places with at least one User or Guest Rating: 90 of 408 on 2026-09-23. Take a fresh read-only count on release day.
- **Check date:** eight weeks after release. Judge the eight-week total only.
- **It works** when, over those eight weeks:
  - `rating_saved` with `surface: 'neighborhood_card'` reaches at least 0.5% of Neighborhood page views, and at least 5 in total;
  - at least one Characteristic "Yes" on a card for every three card Ratings (one question per card, so lower than the Place page's one in two);
  - `contribution_failed` with `surface: 'neighborhood_card'` is under 10% of card Rating attempts;
  - Places with a first User or Guest Rating grow by at least 5 more than over the eight weeks before release (the full list exists to reach unrated Places).
- **Where it breaks, from the GA funnel:**
  - `shortlist_view` high but `shortlist_map_click` and `neighborhood_card_click` near zero: the Shortlists aren't what people came for;
  - card clicks healthy but card Ratings near zero: people use the page to choose, not to rate, so the beans on cards are the issue;
  - Ratings mostly from the full list's unrated Places: good, the full list works; consider moving it up.
- **Below 2 card Ratings in eight weeks:** keep the Shortlists for search visitors, but don't build more contribution onto cards (Visits badges, Quiz cards) before rethinking.
- The window overlaps the One-tap check (see Start gate overridden); `surface` keeps the two apart.

**Dependencies:** reuses `OneTapRating`, the question UI, `trackEvent` and the save-error mapping from One-tap contributions. Visits (#3) will read `ownRating` on cards. The Quiz (#5) will reuse the synonym table, `filteredPlaces` synonyms and the card contribution component.

**Rough cost:** ~5–6 days, from the ranking.
- Backend ~2: the synonym table from real names, synonyms in `filteredPlaces`, `neighborhoodShortlists`, own Review fields, tests.
- Frontend ~3–4: three sections, Shortlist blocks with anchors and "See all", map applying Filters on arrival, card slot and card contribution component with shared cache update, Not found, events, tests.
