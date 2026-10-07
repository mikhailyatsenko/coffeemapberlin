# 08: Loading skeleton

**What to build:** While the page loads, it shows its shape in grey (the header's lines and two shelves of card placeholders) instead of a spinner, so nothing jumps when the data arrives. Frontend only. Spec: [Neighborhood page redesign](../spec.md), "Frontend: page structure".

**Blocked by:** 03 (shelves), 06 (Neighborhood header)

**Status:** done

- [x] The skeleton replaces the spinner and "Loading places..."; it matches the header and shelf sizes at desktop and phone widths
- [x] It is hidden from screen readers except one status message saying the Places are loading
- [x] The error, Not found and "Shortlists fail to load" behavior is unchanged
- [x] A page test shows the loading state while queries are pending
- [x] Checked in the browser through Chrome DevTools MCP with network throttling: no layout jump when the data arrives

## Comments

**2026-10-07, done.**
- While loading, the page shows the h1 (as before), grey blocks for the numbers line and "Open on the map", a row of six grey pills, Top rated as a 3×2 shelf of card placeholders and a Shortlist as a row of 5. The grey blocks are `aria-hidden`; one `sr-only` `role="status"` says "Loading the Places…".
- The primitive is `shared/ui/Skeleton` (`--bg-tertiary`, a pulse that stops under `prefers-reduced-motion`; its class has no specificity, so a sizing class also sets the shape). Each skeleton lives next to what it stands in for and shares its SCSS module: `NeighborhoodPlaceCardSkeleton` in the entity, `ShelfSkeleton`, `TopRatedPlacesSkeleton` and `ShortlistBlockSkeleton` (sizes from `TOP_RATED_SHELF_SIZE` / `TOP_RATED_COLUMNS` and the new `SHORTLIST_SHELF_SIZE`), `SectionSwitcherSkeleton`, `NeighborhoodSummarySkeleton`.
- The card skeleton follows its own width with a container query: below 240px (the row of 5) it shows a two-line name and a two-line rating summary, as the real cards there do.
- `NeighborhoodHeader` now takes `children` instead of `numbers`: the page passes `NeighborhoodSummary` (numbers and "Open on the map", moved out of the header unchanged) once loaded, or the summary skeleton while loading. Without this the h1 would remount when the data arrives.
- Not in the spec, decided here:
  - the switcher row gets a placeholder too (and the page keeps `--section-switcher-height` while loading): the spec names only "the header's lines and two shelves", but the 56px row would otherwise push everything down. A Neighborhood with fewer than two sections still moves up 56px when it loads; that can't be known before the data.
  - a page test for the error state ("Couldn’t load the Places"), which had none; `renderPage` got `allFail`.
- Browser (Chrome DevTools MCP, local backend, Friedrichshain-Kreuzberg, Fast 4G plus an 8 s delay on API fetches through an init script, since Slow 3G with Vite's dev modules didn't load the page within 60 s): at 1280×900 and 375×812 the summary, the switcher, both shelf titles, the first cards and the "See all" buttons sit within 1–2px of where the loaded page puts them; no `layout-shift` entries were recorded; no horizontal page scroll on the phone.
- Left as is: the h1 reads the slug-normalized name while loading ("Friedrichshain-kreuzberg") and the server's spelling once loaded, as before this ticket. The skeleton's heights are measured pixels (33px pills, 32/27px titles, the card's lines); a type or padding change in those components needs the skeleton updated with it.
