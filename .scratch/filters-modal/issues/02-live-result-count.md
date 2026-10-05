# 02: Show a live result count in the Filters modal before Apply

**What to build:** The Filters modal's sticky footer shows how many Places the current Rating, Neighborhood and Features selection matches — "24 places match" — updating about 300 ms after the visitor stops changing Filters, before "Apply Filters". It reads "Counting places…" until the first count, dims the last count while a new one is pending, says "No places match these filters" with a hint to loosen them on zero, and disappears if the request fails. The count always counts what "Apply Filters" then fetches. No backend change: a new query asks `filteredPlaces` for `total` only. See [spec](../spec.md), Implementation Decisions (Live result count).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] A new `FilteredPlacesCount` GraphQL document, beside the filtered-places query, selects only `filteredPlaces(...).total` with the same variables; generated code updated with `npm run codegen`.
- [x] Turning the three Filters into query variables (`minRating` only when > 0, lists only when non-empty) is one pure function in the filters store slice, re-exported by name; `MainPage`'s Apply uses it and behaves as before, and `MainPage.test.tsx` passes unchanged.
- [x] A hook in `FilterPanel`'s `api/` wraps the generated count query: skipped while the modal is closed, first request at once on open, then debounced 300 ms after the last change, `fetchPolicy: 'no-cache'`, stale responses never overwrite newer ones; it returns a counting / ready (total, isUpdating) / unavailable state.
- [x] `FilterFooter` takes that state as a prop and renders one `role="status"` line above Reset/Apply: "Counting places…", "1 place matches" / "N places match", the zero message plus the muted hint line, the last count dimmed with `aria-busy="true"` while updating, nothing on error.
- [x] With no Filters selected the count shows every Place's total.
- [x] "Apply Filters" and "Reset" behave as today; Apply is never disabled by the count.
- [x] `FilterPanel.test.tsx`, with count mocks keyed by variables and real timers, covers: "Counting places…" then the all-Places total on open; a Neighborhood pick updating the count; a zero result with the hint; "1 place matches"; an errored request leaving no count while Apply still calls `onApplyFilters`. Existing tests get the count mock and still pass.
- [x] Checked in the browser at 1440×900 and 390×844 in both themes (the app has no dark theme, so light only): the line sits in the sticky footer, dims while updating, the zero state reads well; quick taps on several Features send one count request after the pause.
