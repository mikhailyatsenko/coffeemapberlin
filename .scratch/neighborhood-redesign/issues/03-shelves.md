# 03: Top rated and Shortlists as shelves of compact cards

**What to build:** Top rated shows the 6 best Places with "See all N on the map", and Top rated and every Shortlist render as shelves of compact cards: a 3×2 grid and rows of 5 on desktop, swipeable carousels on a phone. The first Shortlist is now a short scroll away. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: page structure", "See all and Open on the map", "Frontend: cards".

**Blocked by:** 01 (Remove the Characteristic question from Neighborhood cards)

**Status:** ready-for-agent

- [ ] Top rated shows at most 6 Places, best first, and "See all N on the map" with N = every Place at 4.5 or higher; it sets the Filters to the Neighborhood and minimum Rating 4.5 (Search cleared, Favorites off), navigates to the map and sends `shortlist_map_click` with `shortlist: 'top_rated'`, `neighborhood`, `count`
- [ ] The Filters helper used by Shortlists' "See all" takes optional Amenities and a minimum Rating; Shortlists' "See all" behaves as before
- [ ] The `NeighborhoodPlaceCard` entity becomes the compact shelf card: photo, name, `RatingSummary`, Favorite, street and number without the postcode; no Neighborhood badge, description, Instagram or contribution slot; cards in a shelf are the same height
- [ ] Shelves have no "Rate it"; the full list keeps today's cards with "Rate it" until ticket 04
- [ ] A shelf component renders Top rated and each Shortlist block; section ids, Shortlist order, hiding under 3, `shortlist_view` and `neighborhood_card_click` are unchanged
- [ ] The page container widens to the site's container width; phone carousels use native horizontal scroll with snap points and the next card peeking; no carousel library
- [ ] Page tests cover the 6-card cut, Top rated "See all" (Filters, navigation, event), no badge, the short address, and no "Rate it" on shelves; existing Shortlist tests stay green
- [ ] Checked in the browser through Chrome DevTools MCP: 3×2 grid and rows of 5 at 1280px, carousels at 375×812 with the next card peeking, Tab focus scrolls a carousel card into view, Top rated "See all" shows N Places on the map
