Type: grilling
Status: resolved
Blocked by: 01, 03, 04, 05, 06, 07, 08

## Question

Rank every improvement decided on this map into a single prioritized list, each with its rationale and a rough frontend/backend cost. Destination reached once this is answered; picking what to build next is the user's call.

## Answer

Compiled every concrete improvement decided across [Place page map isolation](02-place-page-map-isolation.md), [Navigation and IA](03-navigation-and-ia.md), [Visual identity and typography](04-visual-identity-and-typography.md), [Mobile map+list interaction](05-mobile-map-list-interaction.md), [Filters and search UX](06-filters-and-search-ux.md), [Forms UX](07-forms-ux.md), and [Loading, empty states and microcopy](08-loading-empty-states-microcopy.md) — 21 frontend items plus one backend item on its own track. [Modern reference research](01-modern-reference-research.md) is the evidence base these draw on, not itself a buildable item.

Ranking principle, confirmed with the user: cheapest, most unambiguous fixes first, then consistency polish, then structural changes, with the one big item (the mobile bottom sheet) and the one backend item last/separate.

### Tier 1 — cheap, unambiguous (trivial/small frontend)

1. Fix the mobile hamburger toggle's missing accessible role/name — [Navigation and IA](03-navigation-and-ia.md)
2. Fix the mobile nav overlay's incomplete viewport coverage — [Navigation and IA](03-navigation-and-ia.md)
3. Rename "Best Bars in Your Area" → "Neighborhoods" — [Navigation and IA](03-navigation-and-ia.md)
4. `EmptyFilterResults`: swap the emoji icon for the site's SVG system, fix the Reset button's text color — [Loading, empty states and microcopy](08-loading-empty-states-microcopy.md)
5. Fix the Place-count pluralization bug site-wide — [Loading, empty states and microcopy](08-loading-empty-states-microcopy.md)
6. Style `FilterPanel`'s "Loading features..." text with the existing Spinner — [Loading, empty states and microcopy](08-loading-empty-states-microcopy.md)
7. Restore Contact's mobile heading/subtext — [Forms UX](07-forms-ux.md)
8. Add an upfront password-length hint on Sign up — [Forms UX](07-forms-ux.md)
9. Drop the decorative accent color from MainPage Place-card names — [Visual identity and typography](04-visual-identity-and-typography.md)
10. Add an active-filter count badge and accessible name to the funnel icon — [Filters and search UX](06-filters-and-search-ux.md)

### Tier 2 — small/medium consistency polish

11. Bring Suggest a Place's validation to Contact/Auth's disabled-until-valid live-validation pattern — [Forms UX](07-forms-ux.md)
12. Split the full-screen Loader into heavy-load (full-screen) and light-action (inline spinner) treatments, across ~15 call sites — [Loading, empty states and microcopy](08-loading-empty-states-microcopy.md)
13. Converge MainPage card ratings onto the number+beans+count pattern — [Visual identity and typography](04-visual-identity-and-typography.md)
14. Add a real typography weight hierarchy (headings and small text off the flat weight-200 default) — [Visual identity and typography](04-visual-identity-and-typography.md)
15. Give the Filters modal's Neighborhood section the same compact-grid treatment as the nav picker (shares its build with #16) — [Filters and search UX](06-filters-and-search-ux.md)

### Tier 3 — medium, structural

16. Redesign the 13-item Neighborhood picker as a compact grid, expanding inline on mobile inside the hamburger menu — [Navigation and IA](03-navigation-and-ia.md)
17. Isolate the map to a single Place and auto-open its card from "Show location on the map" — [Place page map isolation](02-place-page-map-isolation.md)
18. Bring Suggest a Place's visual treatment to Contact's atmospheric-photo look — [Forms UX](07-forms-ux.md)
19. Add a search box plus a "common features"/"Show all" collapse to the Filters' Features list — [Filters and search UX](06-filters-and-search-ux.md)
20. Add a live result-count preview inside the Filters modal before Apply — [Filters and search UX](06-filters-and-search-ux.md)

### Tier 4 — bigger

21. Implement the bottom-sheet mobile map+list pattern for real (drag physics, snap heights, handle styling) — a rough prototype already exists on branch `prototype/mobile-map-list-variants` as a head start — [Mobile map+list interaction](05-mobile-map-list-interaction.md)

### Separate track — backend

22. Dedupe near-duplicate Amenity tag data (e.g. "Cash only"/"Cash-only") — handed off as `../coffemap-server/.scratch/amenity-tag-dedup/problem.md`, not yet even a ticket (open questions on canonical spelling and migration approach remain), needs its own backend session before it can be estimated further — [Filters and search UX](06-filters-and-search-ux.md)

The user reviewed this full draft and confirmed it as final, no reordering. Destination reached: this ranked list is the map's deliverable. Picking what to build next, and turning a picked item into its own spec/tickets, is the user's call.
