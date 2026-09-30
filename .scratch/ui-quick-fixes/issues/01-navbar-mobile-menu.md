# 01: Fix the mobile hamburger menu's overlay and accessibility

**What to build:** Opening the mobile nav (hamburger) menu visibly dims the page behind it, and the hamburger toggle itself is a real, labeled control a screen-reader user can find and understand.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The hamburger toggle is a `<button>` (not a bare `<div>`), reachable via `getByRole('button', ...)`.
- [ ] The toggle's accessible name reflects state: "Open menu" when closed, "Close menu" when open (or equivalent), via `aria-label` and `aria-expanded`.
- [ ] The existing X-morph bar animation and click-to-toggle behavior are unchanged.
- [ ] When the menu is open, the overlay behind it uses the site's `--overlay` design token so the map and Place-card strip are visibly dimmed underneath, not fully visible.
- [ ] The overlay's positioning is `position: fixed` (not `absolute`) so its coverage doesn't depend on being nested inside the navbar element.
- [ ] Clicking the overlay still closes the menu, as it does today.
- [ ] A new `Navbar.test.tsx` (or extension of an existing one, if since added) renders the navbar, queries the toggle by role/name, and asserts the overlay and accessible-name state after clicking.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §1–2.
