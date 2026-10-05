Status: resolved

# Neighborhood picker: a compact grid in the nav and in Filters (items 16 and 15 of the ui-ux-audit map)

Source: [Rank every improvement decided on this map](../ui-ux-audit/issues/09-rank-candidates.md), Tier 3 item 16 and Tier 2 item 15. Decisions drawn from [Navigation and IA](../ui-ux-audit/issues/03-navigation-and-ia.md) (decisions 2 and 3) and [Filters and search UX](../ui-ux-audit/issues/06-filters-and-search-ux.md) (decision 4), plus the test seams confirmed with the user while writing this spec (see Testing Decisions). Frontend only.

## Problem Statement

The site has two Neighborhood pickers, and both make a visitor work too hard to scan thirteen names:

- **The nav's "Neighborhoods" picker** is one long vertical column. On desktop it fits without scrolling but hangs down over the map. On mobile it is the real pain point: inside the open hamburger menu, tapping "Neighborhoods" opens a third layer — a separate bottom-sheet dialog stacked on top of the menu overlay — holding thirteen rows of ~70px each, so the visitor scrolls a full screen of names to find theirs, then closes two layers to get back.
- **The Filters modal's Neighborhood section** is a loose cloud of pills that wrap at whatever width each name happens to have, centered, inside its own 300px (250px on mobile) scroll box nested in the scrolling modal. It looks nothing like the nav picker, though both pick from the same thirteen Neighborhoods, and the nested scroll can hide names below the fold of a box inside a box.

The two pickers do different things — the nav one navigates to a Neighborhood's landing page (`/neighborhood/<slug>`), the Filters one toggles which Neighborhoods MainPage shows — and that difference stays. The problem is only how the names are laid out and, on mobile, how many layers the nav picker opens.

## Solution

1. Lay out the Neighborhoods in both pickers as one compact multi-column grid of equal cells — the same look in the nav and in Filters: three columns where there's room (desktop dropdown, desktop Filters modal), two on phone widths.
2. **Nav, desktop:** the "Neighborhoods" dropdown opens a panel holding the grid instead of a single column. Picking a Neighborhood still goes to its landing page and closes the panel.
3. **Nav, mobile:** inside the open hamburger menu, tapping "Neighborhoods" expands the grid inline, right under the trigger, pushing the menu items below it down. Tapping it again collapses it. No separate dialog. Picking a Neighborhood goes to its landing page and closes the menu.
4. **Filters modal:** the Neighborhood section shows "All" plus the thirteen Neighborhoods in the same grid, with today's behavior — "All" clears the selection, each Neighborhood toggles, several can be selected — and selected cells highlighted as today. The section's own scroll box goes; the modal's scroll is the only one.

No backend change, no new dependencies, no change to what the pickers do on selection.

## User Stories

1. As a desktop visitor, I want the "Neighborhoods" dropdown to show all thirteen Neighborhoods in a compact grid, so that I can scan them at a glance instead of reading down a long column.
2. As a desktop visitor, I want the dropdown panel to stay fully on screen at any desktop width, so that no Neighborhood is cut off at the right edge.
3. As a desktop visitor, I want clicking a Neighborhood in the dropdown to take me to "Best Coffee Places in <Neighborhood>" and close the dropdown, so that picking works exactly as before.
4. As a desktop visitor, I want clicking outside the open dropdown to close it, so that it behaves as it does today.
5. As a mobile visitor with the hamburger menu open, I want tapping "Neighborhoods" to expand the grid right there in the menu, so that I don't land in yet another layer on top of the menu.
6. As a mobile visitor, I want the grid to use two columns, so that thirteen Neighborhoods take about seven short rows instead of a full screen of scrolling.
7. As a mobile visitor, I want tapping "Neighborhoods" again to collapse the grid, so that I can get back to the other menu items.
8. As a mobile visitor, I want the "Neighborhoods" trigger to tell assistive tech whether the grid is expanded, so that a screen-reader user knows the state.
9. As a mobile visitor, I want tapping a Neighborhood to take me to its landing page and close the menu, so that I end up on the page I asked for with nothing left open.
10. As a mobile visitor, I want the menu to scroll when the expanded grid makes it taller than the screen, so that "Suggest a Place", "Journal", "About" and "Contact" stay reachable below the grid.
11. As a mobile visitor who closes the menu with the grid expanded, I want the grid collapsed the next time I open the menu, so that the menu always opens in its short, familiar form.
12. As a mobile visitor, I want tapping a grid cell not to make the whole Neighborhoods menu item shrink and wobble, so that the menu's press effect applies to the menu items, not to the grid inside one.
13. As a visitor with a long Neighborhood name like Charlottenburg-Wilmersdorf or Dahlwitz-Hoppegarten, I want the name to wrap inside its cell rather than overflow or be cut, so that every name is readable in full.
14. As a touch visitor, I want each cell to be a comfortable tap target, so that I don't hit the neighbor of the Neighborhood I meant.
15. As a visitor opening Filters, I want the Neighborhood section to show "All" and the thirteen Neighborhoods in the same grid as the nav picker, so that the two pickers feel like one product.
16. As a visitor in Filters, I want tapping "All" to clear my Neighborhood selection and show "All" as selected, so that I can get back to every Neighborhood in one tap.
17. As a visitor in Filters, I want to select several Neighborhoods and see each selected cell highlighted, so that I can compare, e.g., Mitte and Pankow together.
18. As a visitor in Filters, I want tapping a selected Neighborhood to deselect it, so that toggling works as it does today.
19. As a screen-reader user in Filters, I want each Neighborhood cell and "All" announced as pressed or not pressed, so that I know what's selected without seeing the highlight.
20. As a visitor in Filters, I want the whole Neighborhood section visible without a scroll box of its own, so that there's only one scroll to manage in the modal.
21. As a visitor in Filters, I want my Neighborhood selection to apply only when I press "Apply Filters", so that the grid changes nothing about when filters take effect.
22. As a screen-reader user, I want each grid announced as a group named after what it picks (e.g. "Neighborhoods"), so that I know where I am when I move into it.
23. As a visitor while the Neighborhoods are still loading, I want a short loading line in place of the grid, so that I'm not shown fake disabled buttons.
24. As a visitor when the Neighborhoods fail to load or none come back, I want a short "No neighborhoods" line in place of the grid, so that I know there's nothing to pick rather than seeing an empty box.
25. As a visitor who sees both pickers in one session, I want the same cell look, spacing and order in both, so that I recognize the list the second time.

## Implementation Decisions

- **Where the shared grid lives: a new entity slice, `NeighborhoodGrid`.** The two consumers are the `NeighborhoodDropdown` feature (rendered by the `Navbar` widget) and the `NeighborhoodFilter` sub-component of the `FilterPanel` feature. Two slices need it from the start, so pages-first doesn't apply (it covers UI used by one page), and same-layer feature-to-feature imports are banned, so the grid goes below `features/`. It goes to `entities/` rather than `shared/ui/` because it is the presentational UI of a business-domain object — a list of Neighborhoods, sized for their long hyphenated names — not a design-system primitive. It holds no data access (lint forbids data imports in `entities/*/ui`): each consumer keeps calling the generated `useAvailableNeighborhoodsQuery` itself, which the architecture doc allows without a wrapper.
- **The entity's interface is composition, not a variant flag.** It exports two components from `ui/`, re-exported by name from the slice's `index.ts`:
  - `NeighborhoodGrid` — the container: takes an accessible `label` and `children`, renders a group (`role="group"` with that name) laid out as the grid. It owns the column rule, gaps and cell sizing — the decision both pickers share.
  - `NeighborhoodGridCell` — one cell: a `type="button"` taking `children`, `onClick` and an optional `pressed`. When `pressed` is given, the cell sets `aria-pressed` and shows the selected style; when it's omitted, the cell is a plain action button. `pressed` sets one attribute, like `disabled`, so it isn't a flag prop for variants.
  - The nav picker renders a cell per Neighborhood without `pressed`; the Filters section renders an "All" cell and a cell per Neighborhood, each with `pressed`. Neither consumer passes a "mode".
- **Grid layout:** intrinsic columns from the container width (e.g. auto-fill with a minimum cell width around 150px), not viewport breakpoints inside the entity, so the same rule yields three columns in the ~550px Filters modal content and the desktop dropdown panel, and two at phone widths (390px). Cells fill row by row in the server's order. Cell text is left-aligned and wraps at the hyphen when it must; cells in a row share a height. Each cell is at least 44px tall.
- **Cell look:** the Filters section's current pill style becomes the cell style — `--border-primary` border, 8px radius, `--bg-tertiary` background, `--text-secondary` text, 14px — and its `.selected` style (`--accent-primary-light` background, `--accent-primary` border, `--text-primary`, weight 500) becomes the pressed style. Hover (desktop only, as today) uses `--bg-hover` and `--accent-primary` border. Use theme tokens for any new color; the hardcoded colors in the dropdown's styles that this change deletes don't come back.
- **`NeighborhoodDropdown`, desktop (> 900px, the existing `useWidth` breakpoint, matching the navbar's):** the panel under the trigger holds a `NeighborhoodGrid` (label "Neighborhoods") and is wide enough for three columns. It must stay inside the viewport from 901px to wide screens — center or align it against the trigger as needed and check at 901px and 1440px. Click-outside closing stays. Selecting calls `onSelect` and closes, as today.
- **`NeighborhoodDropdown`, mobile (≤ 900px):** the trigger becomes an inline disclosure. When expanded, the grid renders in normal flow right under the trigger, inside the same menu item, full menu width with side padding (16px) and left-aligned cells, not centered like the menu's text. The bottom-sheet dialog, its `PortalToBody` use, its close button and its `modal*` styles are deleted. The trigger keeps `aria-expanded`; drop `aria-haspopup` on mobile, since nothing pops up any more.
- **The trigger's accessible name stays exactly "Neighborhoods"** on both widths (the `▲`/`▼` arrow stays `aria-hidden`), so the existing Navbar test keeps finding it.
- **Collapse with the menu:** the inline grid starts collapsed every time the hamburger menu opens. The menu is only slid off-screen when closed, not unmounted, so `NeighborhoodDropdown`'s open state survives a close today; `Navbar` and the dropdown need a way to reset it when the menu closes (e.g. the dropdown takes an `isMenuOpen`-style input, or `Navbar` remounts it on close — implementer's choice; keep the dropdown's public props explicit in its `types/`).
- **Mobile menu height and press effect (`Navbar` styles):** the open `navMenu` gets a max height of the viewport below the 60px navbar and scrolls internally, so items under an expanded grid stay reachable. The menu item's `:hover`/`:active` scale-and-recolor effect must not apply while the press lands inside the grid (scope it to the item's own link/trigger rather than the whole `li`).
- **Loading, error and empty states stay in each consumer**, rendered as a single line of text in place of the grid, never as disabled cells: "Loading..." / "No neighborhoods" in the nav picker (replacing today's disabled fake buttons), "Loading neighborhoods..." / "No neighborhoods available" in Filters (today's text; Filters also shows it on error, which today renders only "All").
- **`NeighborhoodFilter`:** keeps its `neighborhood: string[]` prop, its section heading "Neighborhood" and its store actions (`setNeighborhood([])` for "All", `toggleNeighborhood(n)` per cell); "All" is pressed when the selection is empty. The `.neighborhoodList` flex-wrap/centered/max-height scroll box and the `.neighborhoodButton` styles go — the grid and cell replace them. The grid's label is "Neighborhood".
- **Boy-scout inside the touched slices:** `NeighborhoodDropdown` declares its props interface twice (in `ui/` and in `types/`); keep the one in `types/` and import it in `ui/`. Remove `NeighborhoodFilter`'s redundant `ui/index.ts` only if nothing imports it. The inline `NeighborhoodList` component defined inside `NeighborhoodDropdown`'s render goes away with the grid.
- No change to the routing (`/neighborhood/<slug>` built in `Navbar`), the filters store, the GraphQL documents or generated code.

## Testing Decisions

Good tests here assert on what the visitor sees and can do — names, roles, accessible names, `aria-expanded`/`aria-pressed`, where a click navigates, what the store-driven UI shows — not on CSS classes, column counts or component internals. Layout (columns, wrapping, viewport fit, menu scroll) is CSS-only and checked in the browser. The seams are the two existing tests, confirmed with the user; the `NeighborhoodGrid` entity gets no test of its own and is covered through its two consumers. No new test files.

- **`Navbar.test.tsx`** (RTL + `MockedProvider` + `MemoryRouter` + `userEvent`). Change the `AvailableNeighborhoodsDocument` mock to return a few real Neighborhoods (e.g. Mitte, Pankow, Charlottenburg-Wilmersdorf) instead of an empty list, and add a route that renders something identifiable for `/neighborhood/:neighborhood` to assert navigation.
  - Desktop (jsdom's default width is above 900px): opening "Neighborhoods" shows a group named "Neighborhoods" holding a button per Neighborhood; clicking "Pankow" lands on `/neighborhood/pankow` and the group is gone.
  - Mobile (set `window.innerWidth` to 390 before rendering; prior art: `VirtualizedList.test.tsx`): open the menu, tap "Neighborhoods" — it reports `aria-expanded="true"`, the group appears, and there is no `dialog` in the document. Tapping it again collapses it. Tapping a Neighborhood navigates and the menu toggle is back to "Open menu".
  - Collapse with the menu: expand the grid, close the menu, reopen it — the grid is collapsed.
  - Keep the existing tests (menu toggle names, overlay; trigger named "Neighborhoods").
- **`FilterPanel.test.tsx`** (RTL + `MockedProvider` + the real filters store, reset in `afterEach`). Mock a few Neighborhoods instead of an empty list.
  - The Neighborhood section shows a group named "Neighborhood" with "All" pressed and every Neighborhood not pressed.
  - Tapping two Neighborhoods marks both pressed and "All" not pressed; tapping one of them again unpresses it; tapping "All" unpresses every Neighborhood and presses "All".
  - Keep the Features spinner test.
- **Browser check** (chrome-devtools MCP, local dev): desktop 1440×900 and 901px wide — dropdown panel shows three columns and stays on screen; Filters modal shows three columns with no inner scroll box. Mobile 390×844 — hamburger menu, expand Neighborhoods inline in two columns, long names wrap, the menu scrolls to "Contact", no press wobble on cells; Filters bottom sheet shows the two-column grid.

## Out of Scope

- Any backend change, including the order or spelling of Neighborhood names.
- Changing what selection does: the nav picker still navigates to the landing page, the Filters picker still toggles a multi-selection applied by "Apply Filters".
- Turning nav cells into real links (`<a href>`) for the SEO landing pages, or marking the current Neighborhood (`aria-current`) when on its landing page — worth doing, not decided by the audit.
- Keyboard extras for the desktop dropdown beyond today's behavior (Escape to close, focus management, arrow-key movement in the grid).
- The live result-count preview in Filters (item 20) and the Features search/collapse (item 19) — separate map items.
- The rest of the hamburger menu: its toggle's accessibility and overlay coverage (items 1–2, already shipped with [ui-quick-fixes](../ui-quick-fixes/spec.md)) and its other items' styling.
- Replacing hardcoded colors in `Navbar`'s styles beyond what new rules need (that's the `style-tokens` effort's job).

## Further Notes

- Items 16 and 15 share one build, so they ship in order: the entity plus the nav picker first (desktop grid and mobile inline expansion), then the Filters section reusing the entity. That's two tickets; the second is small.
- The 13 Neighborhoods are twelve Bezirke plus Dahlwitz-Hoppegarten (see `CONTEXT.md`); several names are long and hyphenated, which is why cells wrap rather than truncate.
- `useWidth` reads `window.innerWidth` at mount and on a debounced resize, so tests set the width before rendering rather than resizing mid-test.
