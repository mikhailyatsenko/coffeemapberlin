Type: grilling
Status: resolved

## Question

What's the actual friction in Filters (Neighborhood, minimum Average rating, Amenities) and Search (by name) today — on both desktop and mobile? Open and use both on the live site first (the agent hasn't inspected the filter panel yet at charting time), then decide what's worth changing: layout, discoverability, active-filter visibility, empty-results handling, or something else.

## Answer

Walked the live Filters panel and Search (desktop 1440×900 and mobile 390×844, https://3welle.com) before deciding — the agent hadn't inspected the filter panel yet at charting time, per the question. Picking up where [Navigation and IA](03-navigation-and-ia.md) left off: it confirmed Search/Filters *placement* is fine and handed this ticket the Filters panel's own content.

**Key fact**: the "Features" section is a flat, alphabetically-sorted, unsearchable list of ~145 pill buttons — one per distinct raw tag string from Google Places data, no curation. Counted real near-duplicate pairs from inconsistent source-data normalization that split one real-world feature across two labels (e.g. "Bar on site"/"Bar onsite", "Cash only"/"Cash-only", "Cosy"/"Cozy", "Family friendly"/"Family-friendly" — full list in the backend hand-off below), plus ~10 near-synonymous parking tags. Selections AND together ("meets all selected"), so this also makes it easy to zero out results by accident.

Decisions:

1. **Features list**: add a search box at the top of the Features section, and collapse to a smaller "common features" set with a "Show all" expander for the rest. Both are frontend-only fixes within this ticket's scope; they improve discoverability but don't fix the underlying duplicate tags.
2. **Active-filter visibility**: add a count badge to the funnel icon (e.g. showing the number of active filters) and update its accessible name to reflect state (e.g. "Open filters, 2 active") instead of the current unlabeled dot with a static "Open filters" name regardless of state.
3. **Live result-count preview**: add a live count inside the Filters modal as Rating/Neighborhood/Features selections change, before "Apply Filters" — matching the live "N found" pattern Search already does well, instead of the current apply-then-see round trip.
4. **Modal's Neighborhood section**: give it the same compact-grid treatment [Navigation and IA](03-navigation-and-ia.md) is already giving the top-nav's 13-item Neighborhood picker, for visual/interaction consistency between the two Neighborhood pickers on the site (currently loose wrapping pill rows here, not a grid).
5. **Search (by name)**: confirmed already good, no changes — live "N found" counter, a clear zero-match state with message + "Clear search" + "Suggest it" link straight to the suggestion flow. Flagging this here so [Loading, empty states and microcopy](08-loading-empty-states-microcopy.md) doesn't need to re-audit it.
6. **Duplicate tag data**: the user agreed a backend cleanup is worth doing but it's not fully decided (which spelling is canonical, one-off migration vs. ongoing sync-time normalization, whether the parking tags are true duplicates) — handed off to a separate backend session per this repo's CLAUDE.md, as a `problem.md` (not a ready-for-agent ticket, since open questions remain) at `../coffemap-server/.scratch/amenity-tag-dedup/problem.md`.
7. Checked `CONTEXT.md`'s "Amenity" glossary entry against this ticket's findings: the term itself isn't confused with anything — the problem is data quality (duplicate tag strings), not vocabulary. No glossary change.
