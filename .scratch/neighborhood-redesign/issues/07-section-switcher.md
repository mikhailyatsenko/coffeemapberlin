# 07: Section switcher

**What to build:** A row of buttons under the header (Top rated · Work 18 · Dog friendly 9 · … · All 72) scrolls to each section, sticks under the navbar while scrolling and highlights the section in view; on a phone it scrolls sideways. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: page structure", "Analytics".

**Blocked by:** 03 (shelves), 04 (full-list rows)

**Status:** done

- [x] Buttons for Top rated (when shown), each shown Shortlist with its `total`, and All with its total, in page order; a hidden Shortlist has no button; with fewer than two sections there is no switcher
- [x] Each button points at its section's existing id; a tap scrolls smoothly there, moves focus to the section and sends `neighborhood_nav_click` with `neighborhood`, `target` (`top_rated` / Shortlist id / `all`), `actor`
- [x] The switcher sticks under the navbar; the section in view is tracked with `IntersectionObserver` and its button highlighted (`aria-current`)
- [x] Sections' scroll margin includes the switcher's height, so hash links and taps land the title below both bars
- [x] Page tests cover the buttons and counts, hiding, no switcher with one section, the targets and the event
- [x] Checked in the browser through Chrome DevTools MCP: sticking and highlighting while scrolling, `#dog-friendly` on first load lands the title below both bars, sideways scroll at 375×812

## Comments

**2026-10-07, done.**
- The switcher is `pages/NeighborhoodPage/components/SectionSwitcher`. It renders `<a href="#anchor">` links in a `<nav aria-label="Sections">`, and the page builds its items with `lib/switcherSections.ts`. Anchors for Top rated and All are now constants (`TOP_RATED_ANCHOR`, `ALL_PLACES_ANCHOR`), and the minimum of 2 sections is `SWITCHER_MIN_SECTIONS`.
- A tap scrolls smoothly (without animation under `prefers-reduced-motion`), focuses the section (sections got `tabIndex={-1}`, with no outline) and sends `neighborhood_nav_click` through `useNeighborhoodAnalytics` (`trackNavClick`). Cmd/Ctrl/Shift/Alt-clicks and middle clicks are left to the browser. A tap doesn't change the URL hash.
- The current section is the first one, in page order, that crosses a band at 35–40% of the viewport height. Between sections the last one stays current. The link gets `aria-current="location"`. On a phone the row scrolls itself to keep that link visible.
- `--section-switcher-height: 56px` is set on the page only when the switcher is shown. The Shelf and AllPlaces scroll margin is `calc(76px + var(--section-switcher-height, 0px))`.
- Not in the spec, decided here:
  - Top rated has no count, as the ticket and the "Top rated · Work 18" example show. "Frontend: data" mentions "the Top rated count", but the header already shows that number.
  - These are links rather than `<button>`s: they point at the ids and work with Enter. Space doesn't activate a link, which is a step back from story 45's "Enter or Space".
- Test infrastructure: the fake `IntersectionObserver` in the page test now lets several observers watch one element (a Shortlist's `shortlist_view` and the switcher), and it has `leaveViewport`.
- Browser (Chrome DevTools MCP, local backend, Friedrichshain-Kreuzberg):
  - at 1280px the row reads "Top rated · Work 12 · Dog friendly 30 · Outdoor seating 40 · Breakfast & brunch 47 · All 72" and sticks at 60px while scrolling, and the current link follows each of the six sections;
  - a tap on Dog friendly lands its title at 132px (below the 60px navbar and the 56px switcher) with focus on the section;
  - the first load of `#dog-friendly` lands the title at 132px too;
  - at 375×812 the row scrolls sideways (780px of links in 375px, no page horizontal scroll) and centres the current link, and a tap on Work lands at 132px.
  - Found and fixed along the way: a global `nav { padding: 0 20px }` at ≤900px had inset the row.
- Review notes, not acted on:
  - the `scroll-margin-top` line repeats in Shelf and AllPlaces (as the 76px did before), and the 60px navbar height and the container gutters are copied into the switcher's SCSS;
  - `useCurrentSection` keys its effect on `anchors.join(' ')`;
  - the prefers-reduced-motion check repeats `VirtualizedList`'s, see [architecture debt 13](../../architecture-debt/issues/13-duplicated-reduced-motion-check.md).
