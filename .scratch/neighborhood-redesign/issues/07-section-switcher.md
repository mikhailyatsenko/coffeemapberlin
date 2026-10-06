# 07: Section switcher

**What to build:** A row of buttons under the header (Top rated · Work 18 · Dog friendly 9 · … · All 72) scrolls to each section, sticks under the navbar while scrolling and highlights the section in view; on a phone it scrolls sideways. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: page structure", "Analytics".

**Blocked by:** 03 (shelves), 04 (full-list rows)

**Status:** ready-for-agent

- [ ] Buttons for Top rated (when shown), each shown Shortlist with its `total`, and All with its total, in page order; a hidden Shortlist has no button; with fewer than two sections there is no switcher
- [ ] Each button points at its section's existing id; a tap scrolls smoothly there, moves focus to the section and sends `neighborhood_nav_click` with `neighborhood`, `target` (`top_rated` / Shortlist id / `all`), `actor`
- [ ] The switcher sticks under the navbar; the section in view is tracked with `IntersectionObserver` and its button highlighted (`aria-current`)
- [ ] Sections' scroll margin includes the switcher's height, so hash links and taps land the title below both bars
- [ ] Page tests cover the buttons and counts, hiding, no switcher with one section, the targets and the event
- [ ] Checked in the browser through Chrome DevTools MCP: sticking and highlighting while scrolling, `#dog-friendly` on first load lands the title below both bars, sideways scroll at 375×812
