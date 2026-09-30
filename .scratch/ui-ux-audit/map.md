# UI/UX audit: making the site feel modern and convenient

Label: wayfinder:map

## Destination

A ranked list of concrete, specified UI/UX improvements to berlincoffeemap (each with rationale and a rough frontend/backend cost), plus any new-feature idea that surfaces along the way, noted but not specced. Picking what to build, and turning a picked item into its own spec/tickets, is the user's call after this map is walked.

## Notes

- Domain: `CONTEXT.md`; backend in `../coffemap-server` (see `CLAUDE.md` — ask before editing it, even if a finding here points at a backend change).
- Boundary with `.scratch/engagement/`: its feature decisions (one-tap contributions, Shortlists, Quiz, Visits) are already made and are not reopened here. Visual/navigational polish of the same screens is in scope.
- Page priority: MainPage (map + list), PlacePage, NeighborhoodPage are the focus and get specced first. Suggest a Place, Journal, About, Contact are second-tier — ticketed only if a core-page finding turns out to generalize to them.
- Visual scope: polish within the current design system (`shared/ui`, current palette/typography) by default. Changing the tokens themselves only as its own explicit ticket, if a finding shows the tokens are the actual problem, not just their use.
- Accessibility is not a dedicated pass; note it where a ticket trips over it, don't audit for it separately.
- Mobile and desktop are equally weighted.
- A new-feature idea that surfaces mid-audit gets one line in Not yet specified / Out of scope, never a full ticket here.
- Every grilling session: call the Skill tool for "grilling" and "domain-modeling".
- Live site: https://3welle.com — use chrome-devtools MCP (per user's global CLAUDE.md) to look at the real UI before deciding, not just the code.

## Decisions so far

- [Rank every improvement decided on this map into a single prioritized list](issues/09-rank-candidates.md): 21 frontend items ranked cheap-fixes-first across four tiers (trivial fixes → consistency polish → structural changes → the mobile bottom sheet build), plus the Amenity-tag backend dedup on its own track. Full ranked list with rationale and rough cost is in the ticket. **Destination reached** — picking what to build next is the user's call.
- [How does the site handle loading states and empty/zero-result states, and how's the microcopy?](issues/08-loading-empty-states-microcopy.md): split the full-screen blocking Loader into two treatments (full-screen only for heavy page loads, inline/button-level spinner for light actions like Filter re-apply and form submits); fix EmptyFilterResults' emoji icon and low-contrast Reset button; fix a Place-count pluralization bug site-wide; style FilterPanel's bare loading text with the existing Spinner; NeighborhoodPage's content-hiding for empty Top-rated/Shortlist sections confirmed correct, no change. Microcopy tone confirmed already good, no broad fix needed.
- [How convenient and modern do the site's forms feel?](issues/07-forms-ux.md): field style already consistent across Suggest a Place/Contact/Auth (no change); Suggest a Place's validation brought to Contact/Auth's disabled-until-valid live-validation pattern, and its visual treatment brought to Contact's atmospheric-photo look; Contact's mobile heading (currently dropped from the DOM entirely) restored; Sign up gets an upfront password-length hint; Auth staying a modal confirmed fine, not a consistency gap.
- [What's the actual friction in Filters and Search today?](issues/06-filters-and-search-ux.md): Features list gets a search box + "common features"/"Show all" collapse; funnel icon gets an active-filter count badge and accessible name; Filters modal gets a live result-count preview before Apply; modal's Neighborhood section gets the same compact-grid treatment as the nav picker (ticket 03); Search itself confirmed already good, no change. Duplicate/near-duplicate tag data (e.g. "Cash only"/"Cash-only") handed off to a separate backend session as `../coffemap-server/.scratch/amenity-tag-dedup/problem.md`.
- [Is the current mobile layout the right interaction pattern, or would something else feel more modern and convenient?](issues/05-mobile-map-list-interaction.md): prototyped TheFork-style list-primary-with-map-toggle and a bottom-sheet alternative against the current strip-over-map on the live route; the user picked the **bottom sheet** (map stays full-screen and interactive, card strip becomes a peek/half/full sheet) — needs detail polish (real drag physics, snap heights, handle styling) before implementation. Prototype code on branch `prototype/mobile-map-list-variants`, not merged.
- [How dated does the visual identity actually feel, and what's worth polishing within the current design system?](issues/04-visual-identity-and-typography.md): typeface and accent-color hue stay as tokens (not dated, on-brand); add a real weight hierarchy (headings off flat weight-200, small text off 200 to ~400); drop the decorative accent color from MainPage Place names; converge MainPage/NeighborhoodPage card ratings on NeighborhoodPage's number+beans+count pattern; Neighborhood pill green confirmed already-consistent, no change.
- [What's wrong with the site's navigation and information architecture, and what should change?](issues/03-navigation-and-ia.md): "Best Bars in Your Area" leads to real per-neighborhood SEO landing pages (not a Filters duplicate) — keep it, rename to "Neighborhoods", redesign the 13-item picker as a compact grid, expand inline on mobile instead of a stacked dialog; fix the mobile hamburger button's missing accessible role and the nav overlay's incomplete viewport coverage; Search/Filters placement confirmed fine, Filters' own content handed to [Filters and search UX](issues/06-filters-and-search-ux.md).
- [How should the map behave when opened from a Place page's "Show location on the map"?](issues/02-place-page-map-isolation.md): show only that Place's marker (hide every other marker) and open its brief card immediately, instead of returning to the full, cluttered map.
- [What do modern, well-regarded place-directory / map-listing sites do differently?](issues/01-modern-reference-research.md): one sans-serif family with weight-only hierarchy, functional (not decorative) accent color, info-dense cards (rating+count, price/category, open status), a filter-pill row always visible under search, and on mobile a collapsed map-preview-strip-plus-toggle (TheFork) rather than a permanent split.

## Not yet specified

- Polish for second-tier pages (Journal, About, Contact, the Suggest a Place form beyond what [Forms UX](issues/07-forms-ux.md) covers): whether these need their own tickets depends on whether core-page findings turn out to generalize.
- Any new-feature idea surfaced while auditing: to be listed here, one line each, as it comes up, not specced.

## Out of scope

- The feature decisions already made in `.scratch/engagement/` (one-tap contributions, Shortlists, Quiz, Visits): not reopened.
- The admin `SuggestionReviewPage` and `AccountSettingsPage`: not seen by an ordinary visitor, so polish there doesn't serve "nicer and easier for users".
- A formal accessibility (WCAG) audit as its own pass: future effort, not this one.
- Changing the design system's own tokens (palette, typeface, spacing scale) by default: only if a specific ticket explicitly argues the tokens themselves are the problem.
