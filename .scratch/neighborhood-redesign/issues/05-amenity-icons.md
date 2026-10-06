# 05: Amenity icons on cards and rows

**What to build:** Every shelf card and full-list row shows small icons for the Shortlist Amenities its Place has (Work, Dog friendly, Outdoor seating, Breakfast & brunch), so a person sees why a Place fits and what else it offers. Frontend; needs the backend field. Spec: [Neighborhood page redesign](../spec.md), "Frontend: data", "Frontend: cards".

**Blocked by:** 02 (Backend: `shortlistIds` on Place properties), 03 (shelves), 04 (full-list rows)

**Status:** ready-for-agent

- [ ] The `FilteredPlaces` and `NeighborhoodShortlists` documents request `shortlistIds`; codegen updated
- [ ] One icon per `shortlistIds` entry, in server order, with an accessible name ("Good for work", "Dog friendly", "Outdoor seating", "Breakfast & brunch") and a tooltip; none for an empty list
- [ ] The icon set and names live with the cards; the page's Shortlist constants keep only titles and anchors
- [ ] Page tests cover icons with their accessible names on a shelf card and a row, and no icons for `[]`
- [ ] Checked in the browser through Chrome DevTools MCP against the local backend: icons on shelves and rows at 1280px and 375×812
