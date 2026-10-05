Status: resolved

# Filters modal: a searchable, collapsed Features list and a live result count (items 19 and 20 of the ui-ux-audit map)

Source: [Rank every improvement decided on this map](../ui-ux-audit/issues/09-rank-candidates.md), Tier 3 items 19 and 20. Decisions drawn from [Filters and search UX](../ui-ux-audit/issues/06-filters-and-search-ux.md) (decisions 1 and 3), plus the test seam confirmed with the user while writing this spec (see Testing Decisions). Frontend only.

## Problem Statement

Two things make the Filters modal hard to use:

- **The Features section is a wall of ~145 pills.** It shows every distinct Amenity tag string the Places carry, alphabetically, with no way to search and no shortcut to the ones people actually look for. Finding "Outdoor seating" or "Dogs allowed" means scanning the whole cloud; on mobile that's several screens of pills inside the bottom sheet. Near-duplicate tags from Google data ("Cash only"/"Cash-only", "Wi-Fi"/"Free Wi-Fi", "Cosy"/"Cozy") make it longer and more confusing still.
- **The visitor picks Filters blind.** Rating, Neighborhood and Features change nothing visible until "Apply Filters". Features AND together ("meets all selected"), so two or three picks easily match zero Places, and the visitor only learns that after the modal closes and `EmptyFilterResults` shows up — then reopens the modal and guesses again. Search already does this well with its live "N found"; Filters doesn't.

## Solution

1. **Features: a search box.** A search field at the top of the Features section narrows the pills as the visitor types, matching anywhere in the name and ignoring case, spaces and hyphens, so "wifi" finds "Wi-Fi" and "Free Wi-Fi", and "cash only" finds both spellings.
2. **Features: common first, "Show all" for the rest.** With no search text, the section shows a short curated set of common Features plus whatever the visitor has already selected, and a "Show all 145 features" button that expands to the full list ("Show fewer" collapses it again).
3. **A live result count.** The modal's footer shows how many Places the current Rating, Neighborhood and Features selection matches — "24 places match" — updating shortly after each change, before "Apply Filters". When nothing matches it says so and suggests loosening the Filters.

No backend change: the count is a separate request for `filteredPlaces`' `total` only. No change to what "Apply Filters" or "Reset" do, or to when Filters take effect on MainPage.

## User Stories

1. As a visitor in Filters, I want a search field at the top of the Features section, so that I can find a Feature by typing instead of scanning ~145 pills.
2. As a visitor typing in the Features search, I want the pills narrowed to the ones whose name contains what I typed, so that I see only what's relevant.
3. As a visitor, I want the search to ignore case, spaces and hyphens, so that "wifi", "Wi-Fi" and "wi fi" all find "Wi-Fi" and "Free Wi-Fi".
4. As a visitor looking for a Feature with two spellings in the data (e.g. "Cash only"/"Cash-only"), I want my search to show both, so that I can see and pick either.
5. As a visitor, I want the search to look through all Features, not just the common ones shown before I typed, so that I can reach any Feature by searching.
6. As a visitor whose search matches nothing, I want a short "No features match" line with a way to clear the search, so that I know the list isn't broken and can get back.
7. As a visitor, I want a clear button in the Features search field, so that I can empty it in one tap.
8. As a keyboard visitor, I want Escape in a non-empty Features search to clear it without closing the modal, so that I don't lose my whole Filters session to clear a search.
9. As a keyboard visitor, I want Escape in an empty Features search to close the modal as it does today, so that Escape keeps meaning "close".
10. As a visitor opening Filters, I want the Features section to start with a short set of common Features, so that the usual picks are right there without scrolling.
11. As a visitor, I want a "Show all N features" button below the common set, so that I can still browse the full list when I want to.
12. As a visitor with the full list open, I want a "Show fewer" button, so that I can collapse it back.
13. As a screen-reader user, I want the "Show all" button to report whether the list is expanded, so that I know the state.
14. As a visitor who selected a Feature outside the common set (via search or the full list), I want it to stay visible in the collapsed view, so that my selections are never hidden behind "Show all".
15. As a visitor, I want the Features in the same order as today in every view, so that the list stays predictable as it grows or shrinks.
16. As a screen-reader user, I want each Feature pill announced as pressed or not pressed, so that I know what's selected without seeing the color.
17. As a visitor, I want selecting and deselecting Features to work as today (several at once, all must match), so that only the way I find them changes.
18. As a visitor reopening Filters, I want the Features search empty and the list collapsed, so that the modal opens in its short, familiar form while my selections are kept.
19. As a visitor in Filters, I want to see how many Places match my current selection, so that I know what "Apply Filters" will give me before I press it.
20. As a visitor changing Rating, Neighborhood or Features, I want the count to update on its own shortly after each change, so that I can see the effect of each pick.
21. As a visitor tapping several Features quickly, I want the count to settle once I pause rather than flicker through every intermediate number, so that it stays readable and the app doesn't send a request per tap.
22. As a visitor, I want the previous count to stay visible, dimmed, while the new one loads, so that the footer doesn't jump or blank out on every change.
23. As a visitor opening Filters, I want a short "Counting places…" line until the first count arrives, so that the footer doesn't show a wrong or empty number.
24. As a visitor whose selection matches no Places, I want the footer to say "No places match these filters" with a hint to remove a Feature or lower the rating, so that I can fix it before applying.
25. As a visitor whose selection matches no Places, I want "Apply Filters" to still work, so that the modal never blocks me; MainPage then shows its usual empty state.
26. As a visitor with no Filters selected, I want the count to show every Place ("408 places match"), so that the count always means the same thing.
27. As a visitor, I want "1 place match" never to appear — singular and plural are right, so that the count reads naturally.
28. As a screen-reader user, I want the settled count announced politely, so that I hear the result of a change without it interrupting me.
29. As a visitor, I want the count to match exactly what "Apply Filters" then shows, so that I can trust it.
30. As a visitor when the count request fails, I want the count line simply absent and Apply working as before, so that a failed preview never gets in the way.
31. As a mobile visitor, I want the count in the sticky footer next to "Apply Filters", so that I see it without scrolling the bottom sheet, wherever I am in the Features list.

## Implementation Decisions

### Features search and collapse (item 19)

- **Where the logic lives:** `TagsFilter` (a sub-component of the `FilterPanel` feature) stays the place that renders the Features section. Its search text and expanded state move into a hook in `TagsFilter`'s `model/`; the selection rule is a pure function in `TagsFilter`'s `lib/`. `ui/` keeps rendering only (the "Component doing several jobs" heuristic). Its props stay `availableTags` and `selectedTags` (plus today's `isMobile`); no new flag props.
- **Common Features: a curated constant in `FilterPanel`'s `constants/`**, a list of tag strings exactly as the server sends them. Starting list (the user may edit it in review): Free Wi-Fi, Good for working on laptop, Quiet, Outdoor seating, Dogs allowed, Vegan options, Vegetarian options, Breakfast, Brunch, Takeaway, Wheelchair accessible entrance, Cash only. Only the entries present in `availableTags` show, so a renamed or deduped tag on the backend just drops out instead of showing a dead pill. Usage-based ranking (most-tagged Features) needs per-tag counts from the server and is out of scope.
- **What's visible, as one rule** (the `lib/` function's job):
  - Search text present (after trimming): every tag in `availableTags` whose normalized name contains the normalized query, regardless of the expanded state. Normalization lowercases and strips spaces and hyphens on both sides.
  - No search text, collapsed: tags that are in the common set or selected, in `availableTags` order.
  - No search text, expanded: all of `availableTags`.
  - If the collapsed view would show every tag anyway (tiny list) or the common set matches nothing in `availableTags`, there's nothing to expand: show everything and no toggle.
  - Order is always `availableTags` order (the server's alphabetical order), never the curated list's order.
- **Search field:** `type="search"`, accessible name "Search features", placeholder "Search features", sitting between the section heading and the pills, full section width. It has a clear button ("Clear features search") while non-empty. Escape with text clears it and must not reach the modal's document-level Escape handler (stop propagation in the field's key handler); Escape on an empty field closes the modal as today. Match the look of Search's field (`SearchPlaces`) in theme tokens; no new colors.
- **"Show all" toggle:** a `type="button"` below the pills, shown only with no search text and something to expand. Collapsed: "Show all N features" (N = `availableTags.length`); expanded: "Show fewer". It carries `aria-expanded`. Text-button style, accent color, at least 44px tap height.
- **No matches:** a single line "No features match “<query>”" with a "Clear search" text button, in place of the pills.
- **State lifetime:** both search text and expanded state are local and reset whenever the modal opens. `FilterPanel` returns `null` while closed, so `TagsFilter` remounts on each open; no store changes. Selected Features live in the filters store as today.
- **Pills:** keep `BadgePill` inside a `type="button"` and `toggleTag`. Boy-scout inside the touched component: add `aria-pressed` to each Feature button (the Neighborhood cells already have it).
- The heading "Features (meets all selected)" stays. The loading state stays `FilterPanel`'s spinner.

### Live result count (item 20)

- **New GraphQL document, `FilteredPlacesCount`,** next to `GET_FILTERED_PLACES` in the places queries: the same `filteredPlaces(neighborhood, minRating, additionalInfo)` field with the same variable types, selecting `total` only. Regenerate with `npm run codegen`. No schema change: `filteredPlaces` already returns `total`. (The server still computes the matching Places for this request; it just doesn't send them.)
- **One mapping from Filters to query variables, shared by preview and Apply.** Today `MainPage`'s `handleApplyFilters` builds the variables inline (`minRating` only when > 0, `neighborhood`/`additionalInfo` only when non-empty, otherwise `undefined`). Move that mapping into a pure function in the filters store slice (`shared/stores/filters`, a `lib/` segment, re-exported by name from the store's index) and use it from both `MainPage` and the preview, so the count always counts what Apply fetches. `MainPage`'s behavior doesn't change, including "no active Filters → no request, show all Places".
- **The preview hook lives in `FilterPanel`'s `api/`** (it wraps the generated `useFilteredPlacesCountQuery` and adds debounce, skip and display-state logic, so it isn't a Middle Man). It reads `minRating`, `neighborhood` and `selectedTags` and whether the panel is open, and returns a display state for the footer, for example:

  ```ts
  type ResultCount =
    | { status: 'counting' }                       // no count yet since the modal opened
    | { status: 'ready'; total: number; isUpdating: boolean } // isUpdating: a newer count is pending
    | { status: 'unavailable' };                   // the request failed
  ```

- **Debounce: 300 ms** after the last change to any of the three Filters, then one request. The first request on open goes out at once, without waiting. While a change is waiting out the debounce or its request is in flight, the last total stays shown with `isUpdating: true`. Out-of-date responses never overwrite a newer one (Apollo's variable switching on a `useQuery` with debounced variables gives this; don't use a lazy query fired from effects).
- **Skip while the modal is closed;** no request on MainPage load.
- **Fetch policy `no-cache`** for the count query. The shared `InMemoryCache` has no type policies, so a `{ total }`-only result written to the same `filteredPlaces(args)` field would replace the full result `MainPage` reads and log Apollo's data-loss warning. Keeping the preview out of the cache avoids both; the debounce keeps the extra requests few.
- **No active Filters:** the preview still asks, with all variables `undefined`, and shows every Place's total — the same meaning as with Filters.
- **Where it renders: `FilterFooter`,** in the sticky footer above the Reset/Apply buttons, one centered line of small text. `FilterFooter` gets the display state as a prop (narrow props: the `ResultCount` value, not the store). Texts:
  - counting: "Counting places…"
  - ready, total > 0: "1 place matches" / "N places match"
  - ready, total 0: "No places match these filters" plus a second, muted line "Try removing a feature or lowering the rating", in the theme's warning/accent token
  - updating: the last ready text at reduced opacity with `aria-busy="true"`
  - unavailable: nothing (the line's space collapses)
- **Announcing:** the line is a `role="status"` region (polite). It changes text only when a request settles or the modal opens, so screen readers hear settled counts, not every keystroke.
- **Apply and Reset stay as they are:** Apply is never disabled by the count; Reset still clears the three Filters (the count then follows to the all-Places total).
- The count covers Filters only. It doesn't apply Search's name matching or the Favorites view, the same as "Apply Filters" fetching by Filters only today.

### Shared

- Theme tokens only for any new color. No new dependencies (a 300 ms debounce is a small `useEffect`/`setTimeout` or `lodash-es`'s `debounce`, which the app already uses; implementer's choice).
- No change to the filters store's state shape or actions, `useApplyFiltersOnArrival`, `EmptyFilterResults`, the Neighborhood or Rating sections, or the funnel button's badge.

## Testing Decisions

Good tests here assert on what the visitor sees and can do — roles, accessible names, `aria-pressed`/`aria-expanded`, visible text, which Places count the footer reports for which selection — not on hook internals, debounce timers or CSS. The seam is the existing `FilterPanel.test.tsx`, confirmed with the user: RTL + `MockedProvider` + the real filters store, reset in `afterEach`. The `lib/` selection rule and the variables mapping get no tests of their own; they're covered through the panel. No new test files.

- **Mocks:** extend the `GetAvailableTagsDocument` mock to a dozen-plus tags that include a few common ones (e.g. "Dogs allowed", "Outdoor seating", "Free Wi-Fi"), a few uncommon ones, and a hyphen pair ("Cash only", "Cash-only"). Add `FilteredPlacesCountDocument` mocks keyed by variables (e.g. no Filters → 408, a Neighborhood → 24, a Neighborhood plus a Feature → 0). Mark mocks the test may hit more than once as reusable (`maxUsageCount` or `newData`) rather than duplicating them.
- **Features search and collapse:**
  - Collapsed by default: the common tags present show, an uncommon one doesn't, and "Show all N features" reports `aria-expanded="false"`. Clicking it shows the uncommon tag and turns into "Show fewer" with `aria-expanded="true"`; clicking again collapses.
  - Typing "cash only" into "Search features" shows both "Cash only" and "Cash-only" and hides the rest; "Show all" isn't shown while searching. Typing "wifi" finds "Free Wi-Fi".
  - Selecting an uncommon tag via search, then clearing the search, leaves it visible and pressed in the collapsed view.
  - A query that matches nothing shows "No features match" and "Clear search" brings the collapsed list back.
  - Escape in the non-empty field clears it and the modal is still open (the dialog content is still in the document); Escape again closes it (`isFilterPanelOpen` false / content gone).
  - Feature buttons report `aria-pressed` and toggle it on click.
- **Live count:** use real timers and `findBy*` (300 ms is inside the default timeout) rather than fake timers, which fight `MockedProvider` and `userEvent`.
  - On open with no Filters, the status reads "Counting places…" then "408 places match".
  - Selecting a Neighborhood leads to "24 places match"; adding a Feature leads to "No places match these filters" with the hint line.
  - A mock that returns `total: 1` reads "1 place matches".
  - A count request that errors leaves no count text and "Apply Filters" still calls `onApplyFilters`.
  - Keep the existing Features-spinner and Neighborhood tests; they need the count mock so `MockedProvider` doesn't log missing-mock errors.
- **`MainPage.test.tsx`** isn't extended. It never opens the modal, so the count query is skipped there; it must keep passing unchanged after `MainPage` switches to the shared variables mapping — that's the regression check for the move.
- **Browser check** (chrome-devtools MCP, local dev against the local or prod API): desktop 1440×900 and mobile 390×844. The Features section opens collapsed with the common pills and the "Show all" button; search narrows and the field's clear button works; the count line sits in the sticky footer above the buttons, dims while updating, settles after a pause, and the zero state's hint reads well in both themes. In the Network panel, quick taps on several Features produce one count request after the pause, not one per tap.

## Out of Scope

- Deduplicating near-duplicate Amenity tags ("Cash only"/"Cash-only" and the rest) — backend, already handed off as `../coffemap-server/.scratch/amenity-tag-dedup/problem.md`. The search's hyphen/space-insensitive matching only softens it.
- Usage-based "common features" (ranking by how many Places carry each tag), grouping Features into categories, or renaming tags for display.
- Any backend change, including a count-only resolver that skips building the Places.
- Changing when Filters take effect (still on "Apply Filters"), the "meets all selected" AND semantics, or making Apply disabled on zero results.
- Restoring the previous Filters when the modal is closed without applying: today the store keeps the unapplied picks; this spec doesn't change that.
- Counting Search's name matching or the Favorites view into the preview.
- A live count on the funnel button or anywhere outside the modal; the active-filter badge (item 10) is done.
- Restyling the rest of the modal, its Rating section or its Neighborhood grid (items 15/16, [neighborhood-picker](../neighborhood-picker/spec.md)).

## Further Notes

- Items 19 and 20 are independent and touch different parts of the modal (`TagsFilter` vs. `FilterFooter` plus a new query); they can be two tickets in either order. Item 20 is the one that adds a GraphQL document and moves `MainPage`'s variables mapping.
- The live tag list had 145 entries when this spec was written; the "Show all N" label reads the real length, so it needs no update when the backend dedup lands.
- The modal's Escape handler is a native `keydown` listener on `document`, while the panel renders through `PortalToBody`; stopping propagation in the search field's React key handler stops the native event before it reaches `document`. Worth a test (it's in the list above) because it's the kind of thing a later refactor of the handler breaks.
- Pluralization is inline (`total !== 1 ? 's' : ''`) across the app, e.g. `AllPlaces`; follow that rather than adding a helper.
