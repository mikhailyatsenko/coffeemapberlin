# 02: Rename "Best Bars in Your Area" to "Neighborhoods"

**What to build:** The top-nav dropdown that lists the site's 13 Neighborhoods is labeled "Neighborhoods", matching what it actually opens, instead of "Best Bars in Your Area".

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] The nav dropdown's trigger button reads "Neighborhoods" on desktop and mobile.
- [x] The mobile modal's title (opened from the same dropdown) also reads "Neighborhoods".
- [x] No other behavior of the dropdown changes — same list, same layout, same navigation on selecting a Neighborhood. (The compact-grid redesign of this picker is separate, later work — not part of this ticket.)
- [x] A test (new or extended) queries the nav by `getByRole('button', { name: 'Neighborhoods' })` where the nav is already rendered in an existing test.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §3.
