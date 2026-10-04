# 09: Show an active-filter count on the funnel icon

**What to build:** A visitor with one or more Filters active sees how many filter categories are active directly on the funnel icon, and a screen reader announces the same count via the button's accessible name.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] `FloatingFilterButton` takes an `activeFilterCount: number` prop instead of `hasActiveFilters: boolean`; its internal "is anything active" logic derives from `activeFilterCount > 0`.
- [x] The badge on the funnel icon shows the numeric count (not just a dot) when `activeFilterCount > 0`, and renders nothing when it's 0.
- [x] The button's `aria-label` reads e.g. "Open filters, N active" when active, "Open filters" when not.
- [x] `MainPage` computes `activeFilterCount` by **filter category** — Rating active, Neighborhood active, any Feature tag active each count as 1 (max 3) — not by the number of individually selected Feature tags.
- [x] `MainPage`'s existing `hasActiveFilters` boolean and every one of its other call sites (`FilterPanel`, `FilterFooter`, the empty-results/filtered-places logic) are unchanged — only the new `activeFilterCount` is added and passed to `FloatingFilterButton`.
- [x] `MainPage.test.tsx` gets a case asserting the button's accessible name and badge reflect the count for at least two combinations (e.g. Rating only → 1; Rating + Neighborhood + a Feature tag → 3 regardless of how many tags are selected within that category).

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §11–12.

**Notes:** The count is passed as `filteredPlaces !== null ? activeFilterCount : 0`, not raw, so the badge keeps the old dot's timing: it shows once the Filters' results have loaded, not while Filters are only picked in the panel. The badge grew from a 10px dot to an 18px pill so a digit fits, offset to the button's corner; checked visually in light theme. `hasActiveFilters` keeps its own predicate as the spec asks, even though it now repeats the count's three checks; MainPage holding store reads, queries, derivations and markup in one `ui/` file is recorded as `.scratch/architecture-debt/issues/09-mainpage-several-jobs.md`.
