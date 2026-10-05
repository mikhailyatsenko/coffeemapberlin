# 01: Make the Filters' Features list searchable and collapsed to common Features

**What to build:** The Features section of the Filters modal gets a search field at the top and opens collapsed to a short curated set of common Features plus whatever the visitor already selected, with a "Show all N features" / "Show fewer" toggle for the full list. Searching looks through every Feature, ignoring case, spaces and hyphens, so "wifi" finds "Free Wi-Fi" and "cash only" finds both "Cash only" and "Cash-only". Selecting Features works as today; each pill now tells assistive tech whether it's pressed. See [spec](../spec.md), Implementation Decisions (Features search and collapse).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] The common set is a curated constant of tag strings in the `FilterPanel` feature (the spec's starting list); only entries present in the server's tags show, always in the server's order.
- [x] With no search text the section shows the common Features plus any selected ones, and a "Show all N features" button (N = all Features) with `aria-expanded="false"`; clicking it shows every Feature and becomes "Show fewer" with `aria-expanded="true"`. When there's nothing to expand, everything shows and the toggle doesn't.
- [x] A search field named "Search features" narrows the pills to matches across all Features, case-, space- and hyphen-insensitive; the toggle is hidden while searching; a clear button empties the field.
- [x] A query with no matches shows "No features match “<query>”" with a "Clear search" button in place of the pills.
- [x] A Feature selected via search or the full list stays visible and pressed in the collapsed view.
- [x] Escape in the non-empty search clears it and leaves the modal open; Escape in the empty field closes the modal as today.
- [x] Search text and expanded state reset each time the modal opens; selected Features are kept (filters store, unchanged).
- [x] Each Feature button has `aria-pressed` reflecting selection.
- [x] Search/expanded state lives in a hook in `TagsFilter`'s `model/` and the visibility rule in a pure function in its `lib/`; `ui/` only renders. Theme tokens only; no new dependencies.
- [x] `FilterPanel.test.tsx` covers the behavior above (collapsed default and toggle, "cash only" and "wifi" searches, selection kept after clearing, no-match line, Escape twice, `aria-pressed`) with a tags mock holding common, uncommon and hyphen-pair tags; existing tests still pass.
- [x] Checked in the browser at 1440×900 and 390×844 in both themes: collapsed list, toggle, search and its clear button look right. (The app has one theme only: `theme.css` defines just `:root`.)
