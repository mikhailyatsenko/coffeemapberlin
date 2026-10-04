# 09: MainPage's `ui/` holds the page's filter and loading logic

Status: needs-triage

- **Rule:** `docs/agents/architecture.md`, SOLID heuristics, possible *Component doing several jobs* (S): `src/pages/MainPage/ui/MainPage.tsx` reads the filters and places stores, runs two `useGetPlacesQuery` calls and the filtered lazy query, merges batches, derives which Places to show (Favorites, Filters, search, empty states) and renders the markup. The active Filters are checked twice, once as `hasActiveFilters` and once as `activeFilterCount`.
- **File:** `src/pages/MainPage/ui/MainPage.tsx`
- **Why it wasn't fixed in place:** moving the loading and derivation logic into hooks under `pages/MainPage/model/` rewrites most of the component, far beyond `.scratch/ui-quick-fixes/issues/09-active-filter-count-badge.md`, which only added the count. That spec also says to leave `hasActiveFilters` as it is. A refactor could derive `hasActiveFilters` from the count, or both from one helper.
