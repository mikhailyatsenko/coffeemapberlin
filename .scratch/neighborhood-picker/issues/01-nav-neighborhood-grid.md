# 01: Show the nav's Neighborhoods as a compact grid, expanding inline in the mobile menu

**What to build:** The top nav's "Neighborhoods" picker lays out the thirteen Neighborhoods as a compact grid of equal cells instead of one long column. On desktop the dropdown panel holds the grid in three columns and stays fully on screen; on mobile, tapping "Neighborhoods" inside the open hamburger menu expands the grid inline, two columns, right under the trigger, with no separate dialog on top of the menu. Picking a Neighborhood still goes to its landing page and closes the dropdown or menu. The grid is built as a new shared entity, `NeighborhoodGrid` (container plus cell, composed by the consumer, no data access), so the Filters modal can reuse it in ticket 02. See [spec](../spec.md), Implementation Decisions, for the interface, layout rule, cell look and the mobile menu changes.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] A new `NeighborhoodGrid` entity exposes, by name, a grid container (accessible group with a `label`, `children`) and a cell button (`children`, `onClick`, optional `pressed` that sets `aria-pressed` and the selected style). It imports no data; columns come from the container width (about three in a ~550px panel, two at 390px), cells are at least 44px tall, long names wrap, and colors use theme tokens.
- [x] Desktop: opening "Neighborhoods" shows a group named "Neighborhoods" with a button per Neighborhood; clicking one lands on `/neighborhood/<slug>` and closes the panel; clicking outside closes it as today. The panel stays inside the viewport at 901px and at 1440px.
- [x] Mobile (≤ 900px): in the open menu, tapping "Neighborhoods" sets `aria-expanded="true"` and shows the grid inline; tapping again collapses it; no `dialog` is rendered. The bottom-sheet dialog code and styles are gone.
- [x] Mobile: tapping a Neighborhood navigates to its landing page and the menu toggle is back to "Open menu".
- [x] Mobile: expanding the grid, closing the menu and reopening it shows the grid collapsed.
- [x] Mobile: the open menu scrolls when the expanded grid makes it taller than the viewport below the navbar, so "Contact" stays reachable; tapping a grid cell doesn't trigger the menu item's scale/recolor press effect.
- [x] Loading and empty/error show a single line of text ("Loading..." / "No neighborhoods") in place of the grid, not disabled buttons.
- [x] The trigger's accessible name stays "Neighborhoods" on both widths; `NeighborhoodDropdown`'s props interface is declared once, in its `types/`.
- [x] `Navbar.test.tsx` covers the desktop and mobile behavior above with a mock returning a few real Neighborhoods (mobile via `window.innerWidth = 390` before render); its existing tests still pass.
- [x] Checked in the browser at 1440×900, 901px wide and 390×844.
