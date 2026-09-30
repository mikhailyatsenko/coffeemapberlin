Type: grilling
Status: resolved

## Question

What's wrong with the site's navigation and information architecture, and what should change? Cover: the top nav's "Best Bars in Your Area" item, whose dropdown is actually just a flat, unsearchable list of all 13 Neighborhoods (not "best bars"); the mobile hamburger menu; and how Search (by name) and Filters (Neighborhood, rating, Amenities) relate to and sit next to each other. Ground it in the live site (desktop and mobile), not just the code.

## Answer

Walked the live site (desktop 1440×900 and mobile 390×844, https://3welle.com) via chrome-devtools MCP before deciding.

**Key fact that reframed the question**: clicking a neighborhood inside "Best Bars in Your Area" navigates to a dedicated SEO landing page at `/neighborhood/<slug>` ("Best Coffee Places in Mitte", a ranked card list, no map) — a genuinely different destination from the Filters panel's "Neighborhood" section, which filters MainPage in place. So the nav item isn't a pure duplicate of Filters; it's a distinct, real feature (matches the project's NeighborhoodPage being one of the three priority pages) whose own UX is broken.

Decisions:

1. **Keep the nav item, rename it** from "Best Bars in Your Area" (factually wrong — it's not about bars, and "best" oversells a flat list) to **"Neighborhoods"**.
2. **Redesign the 13-item picker as a compact multi-column grid**, replacing the current single vertical column, on both the desktop dropdown and mobile. Desktop doesn't require scrolling today but the column overhangs the map; mobile is the real pain point (13 rows × ~140px, full-height scroll).
3. **Mobile: expand inline within the open hamburger menu** instead of opening as a third, separate `dialog` stacked on top of the menu overlay — removes one layer of nesting.
4. **Fix the mobile hamburger toggle button's accessibility**: confirmed via chrome-devtools accessibility snapshot that it has no exposed role or accessible name at all (not reachable as a named element; had to be clicked via its container). In scope because it's squarely "the mobile hamburger menu" and cheap to fix — per the map's Notes, accessibility isn't a dedicated pass here but is noted where a ticket trips over it directly, which this does.
5. **Fix the mobile nav overlay's coverage**: opened, it doesn't cover the full viewport — the map and place-card strip are visible underneath the nav items. Same element as #4, same "trips over it" logic.
6. **Search + Filters relative placement (search bar with an adjacent filter icon) is confirmed fine, no change** — it already matches the reference pattern from ticket 01 (Google Maps/TheFork keep search and filter access inline). The *content* of the Filters panel (the ~145-button unsearchable, ungrouped "Features" list with near-duplicate labels; the Filters panel's own "Neighborhood" section) is explicitly **handed off to ticket 06 (filters-and-search-ux)**, not decided here.
7. **`CONTEXT.md` correction**: the "Neighborhood" glossary entry said "one of the city's twelve" — the live list has 13, including Dahlwitz-Hoppegarten, a Brandenburg town just outside Berlin that has Places on the map. Confirmed with the user this is intentional (Places exist there, so it's included), not a data bug. Updated the glossary entry in this session to say twelve Bezirke plus Dahlwitz-Hoppegarten, thirteen total, and added "Bezirk" itself to _Avoid_ since not all thirteen are one.
