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
