# 05: Amenity icons on cards and rows

**What to build:** Every shelf card and full-list row shows small icons for the Shortlist Amenities its Place has (Work, Dog friendly, Outdoor seating, Breakfast & brunch), so a person sees why a Place fits and what else it offers. Frontend; needs the backend field. Spec: [Neighborhood page redesign](../spec.md), "Frontend: data", "Frontend: cards".

**Blocked by:** 02 (Backend: `shortlistIds` on Place properties), 03 (shelves), 04 (full-list rows)

**Status:** done

- [x] The `FilteredPlaces` and `NeighborhoodShortlists` documents request `shortlistIds`; codegen updated
- [x] One icon per `shortlistIds` entry, in server order, with an accessible name ("Good for work", "Dog friendly", "Outdoor seating", "Breakfast & brunch") and a tooltip; none for an empty list
- [x] The icon set and names live with the cards; the page's Shortlist constants keep only titles and anchors
- [x] Page tests cover icons with their accessible names on a shelf card and a row, and no icons for `[]`
- [x] Checked in the browser through Chrome DevTools MCP against the local backend: icons on shelves and rows at 1280px and 375×812

## Comments

**2026-10-06, done.**
- The icons are `entities/NeighborhoodPlaceCard/components/AmenityIcons`: `constants` maps each `ShortlistId` to its name and icon (Work → Wi-Fi, Dog friendly → paw, Outdoor seating → chair, Breakfast & brunch → cutlery, reusing `shared/assets`), `ui` renders a list labelled "Amenities" with `role="img"` + `aria-label` on each icon and a `title` tooltip. The shelf card and the row render it under `RatingSummary`.
- An id this build has no icon for (a newer server) is skipped instead of breaking the card; a page test covers it.
- Codegen: only `shortlistIds` changed in `shared/generated/graphql.ts` (the file is eslint-fixed on commit, so run `npx eslint --fix --no-ignore` on it after `npm run codegen` to keep the diff small).
- Browser (Chrome DevTools MCP, local backend, Friedrichshain-Kreuzberg): 44 of 46 cards and rows show icons in server order with the right names and tooltips; at 1280px shelf cards stay equal height per shelf (393px Top rated, 322px Shortlists); at 375×812 icons fit the carousel card (274px) and the row, no page horizontal scroll.
- Review notes, not acted on: the tooltip is a native `title`, so it doesn't show on touch or keyboard focus (the accessible name does); the page's `SHORTLISTS` and the icon set are two `Record<ShortlistId, …>` maps, as the spec asks (names differ on purpose: "Work" vs "Good for work").
