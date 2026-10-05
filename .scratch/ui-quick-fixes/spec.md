Status: resolved

# Ten quick UI fixes (Tier 1 of the ui-ux-audit map)

Source: Tier 1 of [Rank every improvement decided on this map](../ui-ux-audit/issues/09-rank-candidates.md), items 1–10. Decisions drawn from [Navigation and IA](../ui-ux-audit/issues/03-navigation-and-ia.md), [Visual identity and typography](../ui-ux-audit/issues/04-visual-identity-and-typography.md), [Filters and search UX](../ui-ux-audit/issues/06-filters-and-search-ux.md), [Forms UX](../ui-ux-audit/issues/07-forms-ux.md), and [Loading, empty states and microcopy](../ui-ux-audit/issues/08-loading-empty-states-microcopy.md).

## Problem Statement

Ten small, independent UI problems — each confirmed live on the site and in the codebase during the audit — make berlincoffeemap feel less polished and less accessible than it should:

- A mobile visitor opening the hamburger menu gets a click-catching overlay with no visual dimming, so the map and Place-card strip stay visible underneath the menu; a screen-reader user can't tell the hamburger toggle is a button at all.
- The top nav's "Best Bars in Your Area" label promises something the dropdown doesn't deliver (a flat list of Neighborhoods, not curated bars).
- A visitor who filters down to zero results sees a native OS emoji instead of the site's own icon system, and a "Reset Filters" button whose text is nearly unreadable against its own background.
- Anywhere the site counts something — Places in a Neighborhood, ratings, reviews — a count of exactly one reads as grammatically wrong ("All 1 Places", "from 1 ratings", "1 reviews").
- The Filters panel's tag list loads behind bare, unstyled text while every other loading moment on the site uses the same themed spinner.
- A mobile visitor to the Contact page lands on a bare form with no explanation of what the page is for — the heading and subtext are dropped entirely below 767px.
- Someone signing up only learns the password needs 8+ characters after they've already typed a short one and been rejected.
- A Place's name renders in the brand's accent color on the map's list cards for no functional reason, while the same card elsewhere on the site (NeighborhoodPage) already renders it in neutral text.
- The funnel/filter icon shows only an unlabeled dot when filters are active — no indication of how many, for sighted or screen-reader visitors alike.

None of these are matters of taste — each is either a confirmed bug (pluralization, contrast, accessibility) or a small, already-decided consistency fix (reuse an existing pattern from elsewhere on the same site).

## Solution

Ship all ten as independent, low-risk fixes, each scoped to the one or two files it actually lives in, each reusing an existing pattern or asset already present in the codebase rather than inventing new ones. None require new dependencies, new pages, or backend changes.

## User Stories

1. As a mobile visitor, I want the hamburger menu's overlay to visibly dim the page behind it, so that I can tell the map and Place cards are no longer the active layer.
2. As a screen-reader user, I want the hamburger toggle to expose a role and accessible name, so that I know it's a button that opens the menu.
3. As a screen-reader user, I want the hamburger toggle's accessible name to reflect whether the menu is open or closed, so that I know what activating it will do.
4. As any visitor, I want the "Best Bars in Your Area" nav item renamed to "Neighborhoods", so that its label matches what it actually opens (a flat list of the 13 Neighborhoods, not a curated "best bars" pick).
5. As a visitor who filters down to zero results, I want the empty-state icon to match the rest of the site's icon system, so that the page doesn't look like it's using a placeholder.
6. As a visitor who filters down to zero results, I want the "Reset Filters" button's text to be clearly readable against its background, so that I can find and use the recovery action without straining.
7. As a visitor viewing a Neighborhood with exactly one Place, I want the heading to read "All 1 Place in X", not "All 1 Places in X", so that the page doesn't read as broken or auto-generated.
8. As a visitor viewing a Place with exactly one rating, I want to see "from 1 rating", not "from 1 ratings".
9. As a visitor viewing a Neighborhood-page card for a Place with exactly one review, I want to see "(1 review)", not "(1 reviews)".
10. As a visitor opening the Filters panel, I want the Features tag list's loading moment to use the site's themed spinner, so that it doesn't look like a different, less-finished part of the app while it loads.
11. As a mobile visitor to the Contact page, I want to see the "Let's get in touch!" heading and its subtext, so that I understand what the page is for before I start filling in the form.
12. As a mobile visitor to the Contact page, I want the photo background to render once, not layered/duplicated between the page and a now-hidden text container, so that the page doesn't carry unused weight.
13. As someone signing up, I want to see the password's minimum-length requirement before I start typing, so that I don't get rejected on my first attempt for something I could have known upfront.
14. As a visitor browsing the map's list of Places on MainPage, I want Place names to render in the same neutral text color used on the Neighborhood page's cards, so that the accent color reads as intentional (used for actions/state) rather than decorative.
15. As a visitor with one or more Filters active, I want the funnel icon to show how many filters are active, not just that some are, so that I know how much the results are narrowed without reopening the panel.
16. As a screen-reader user with Filters active, I want the funnel button's accessible name to state how many filters are active (e.g. "Open filters, 2 active"), so that I get the same information sighted visitors get from the badge.
17. As a developer maintaining the site, I want the three now-inconsistent pluralization spots (`AllPlaces`, `AverageRating`, `NeighborhoodPlaceCard`) to follow the same inline pluralization idiom the codebase already uses elsewhere (`AddPhotos`, `PhotoThumbnails`), so that the fix reads as consistent with the rest of the codebase rather than a one-off.
18. As a developer maintaining `FloatingFilterButton`, I want its prop contract to carry the actual count of active filters rather than only a boolean, so that the badge and accessible name can both be driven from one source of truth.

## Implementation Decisions

### 1–2. Navbar hamburger and menu overlay (`widgets/Navbar/ui/Navbar.tsx`, `Navbar.module.scss`)

- The hamburger toggle is currently a plain `<div onClick>` with no semantics. Change it to a real `<button type="button">`, carrying `aria-expanded={isBurgerActive}` and an `aria-label` that reflects state (e.g. `isBurgerActive ? 'Close menu' : 'Open menu'`). Keep its existing `onClick` handler and the three `<span className={cls.bar}>` children (the CSS-driven X-morph animation depends on them).
- `.menuOverlay` currently has no `background-color` at all, so it visually dims nothing — it's purely a click-outside-catcher. Add `background-color: var(--overlay);` (the token already used for this exact purpose elsewhere in the codebase, e.g. `FilterPanel`'s overlay, though that one hardcodes `rgba(0,0,0,0.5)` — prefer the token here for correctness rather than copying the hardcoded value). Switch `.menuOverlay`'s `position` from `absolute` to `fixed` so its `top: 0; left: 0` is unambiguously relative to the viewport rather than to `.navbar` (a `position: fixed`, 60px-tall ancestor) — removes any dependency on `.navbar` not clipping its children.

### 3. Rename nav item (`features/NeighborhoodDropdown/ui/NeighborhoodDropdown.tsx`)

- Two string literals to change, both currently "Best Bars in Your Area": the dropdown trigger button's text (line ~86) and the mobile modal's title (line ~108). Change both to "Neighborhoods". No structural change — the picker's layout (a single scrolling column) is out of scope here; it's [Navigation and IA](../ui-ux-audit/issues/03-navigation-and-ia.md)'s separate compact-grid redesign (Tier 3, ticket 09 item 16), not this spec.

### 4. `EmptyFilterResults` icon and button contrast (`features/FilterPanel/ui/EmptyFilterResults.tsx`, `.module.scss`)

- Replace the `<div className={cls.icon}>🔍</div>` emoji with an `<img>` using the existing `src/shared/assets/search-icon-alt.svg` — a plain single-path outline icon, matching the visual weight of the site's other functional icons (funnel, heart, map pin), unlike `search-icon.svg` which is a colorful flat-illustration icon closer in style to the Loader's coffee-pot animation. Size and opacity should carry over the existing `.icon` rule's `font-size: 64px; opacity: 0.6` intent, adapted to an `<img>`/`width`+`height` (an SVG doesn't take `font-size`).
- `.resetButton` sets `color: var(--text-primary)` on `background-color: var(--accent-primary)` — change to `color: var(--text-inverse)`, matching `FilterFooter.module.scss`'s `.applyButton`, which already gets this right on the identical background color. This is a one-line fix, not a redesign.

### 5. Pluralization (three files)

- `pages/NeighborhoodPage/components/AllPlaces/ui/AllPlaces.tsx`: change `` `All ${total} Places in ${neighborhood}` `` to `` `All ${total} Place${total !== 1 ? 's' : ''} in ${neighborhood}` ``.
- `widgets/DetailedPlace/components/AverageRating/ui/AverageRating.tsx`: change `` `from ${ratingCount} ratings` `` to `` `from ${ratingCount} rating${ratingCount !== 1 ? 's' : ''}` ``.
- `entities/NeighborhoodPlaceCard/ui/NeighborhoodPlaceCard.tsx`: change `` `(${properties.ratingCount} reviews)` `` to `` `(${properties.ratingCount} review${properties.ratingCount !== 1 ? 's' : ''})` ``.
- Follow the inline ternary idiom already used in `features/RateNow/components/AddPhotos/ui/AddPhotos.tsx` and `shared/ui/PhotoThumbnails/ui/PhotoThumbnails.tsx` (`` `${n} photo${n !== 1 ? 's' : ''}` ``) rather than introducing a new pluralization helper — three call sites don't justify a new shared utility, and matching the existing idiom keeps the fix legible as "more of the same," not a new pattern.

### 6. `FilterPanel`'s loading state (`features/FilterPanel/ui/FilterPanel.tsx`)

- Replace the bare `'Loading features...'` string (currently rendered directly where `<TagsFilter>` would go) with the existing `Spinner` component (`import { Spinner } from 'shared/ui/Loader'`, already used this way in `ImgWithLoader`). Wrap it in a small container so it doesn't collapse the section's height to the spinner's own size — match whatever spacing `TagsFilter`'s own section wrapper (`cls.filterSection`) uses, so the loading state doesn't visibly jump when the real content swaps in.

### 7–8. Contact page mobile heading (`pages/ContactPage/ui/ContactPage.tsx`, `.module.scss`)

- `.textContainer` (holding the `<h1>`/`<p>`) is currently `display: none` below 767px, while `.ContactPage` itself separately applies the same `contacts.jpg` as a background image with a dark gradient overlay at that same breakpoint — so the photo already renders on mobile, only the text is gone.
- Stop hiding `.textContainer` on mobile. Instead, at `width <= 767px`: keep `.textContainer` visible but remove its own `background` declaration (avoiding the double-photo layer — `.ContactPage`'s background already covers it), and adjust its layout (e.g. drop `width: 50%`/`40%` in favor of full width, reduce padding) so the heading and subtext sit naturally above the form on a single scrolling column. Text stays white (per the existing `color: white` in `.textContainer`) since it now sits directly over `.ContactPage`'s own dark-gradient photo background.

### 9. Sign-up password hint (`shared/ui/FormField/ui/FormField.tsx`, `features/SignUpWithEmail/ui/SignUpWithEmail.tsx`)

- `FormField` has no hint/helper-text concept today, only `error`. Add an optional `hint?: string` prop, rendered in place of (or alongside) the existing `cls.errorContainer` area when there's no `error` — e.g. render the hint when `!error && hint`, so an active validation error always takes visual priority over the static hint. This is a `shared/ui` addition, not a one-off in `SignUpWithEmail`, since a "helper text under a field" is a generic form-field concept other forms may reasonably want later — but scope this spec's actual *usage* to the one confirmed spot: pass `hint="At least 8 characters"` on the password `FormField` in `SignUpWithEmail.tsx`. No other call site changes.

### 10. MainPage card name color (`features/PlaceCard/ui/PlaceCard.module.scss`)

- `.cardHeader` hardcodes `color: #ff4b34` (the same value as `--accent-primary`, but not the token). Change to `color: var(--text-primary)`, matching the neutral treatment `NeighborhoodPlaceCard` already uses for its own name heading. Verified this only affects the name text and not the favorite-icon button beside it — `AddToFavButton`'s `.AddToFavIcon` sets its own explicit `color: #787878` and renders via a `background-image` SVG, not `currentColor`, so it's unaffected by this change.

### 11–12. Active-filter count badge (`features/FloatingFilterButton/ui/FloatingFilterButton.tsx`, `.module.scss`, `pages/MainPage/ui/MainPage.tsx`)

- `FloatingFilterButtonProps.hasActiveFilters: boolean` becomes `activeFilterCount: number`. Inside the component, derive `hasActiveFilters = activeFilterCount > 0` for the existing `cls.active` class logic, and:
  - Render the count inside the existing `cls.badge` span (e.g. `{activeFilterCount}`) instead of an empty dot, only when `activeFilterCount > 0`.
  - Set `aria-label` to `` activeFilterCount > 0 ? `Open filters, ${activeFilterCount} active` : 'Open filters' ``.
- In `MainPage.tsx`, compute a new `activeFilterCount` alongside the existing `hasActiveFilters` boolean — **do not** change `hasActiveFilters` itself or any of its other call sites (`FilterPanel`, `FilterFooter`, the `showEmptyResults`/`placesToDisplay` logic all only need the boolean and stay as-is). Count by **filter category**, not by individual selected value: `(minRating > 0 ? 1 : 0) + (neighborhood.length > 0 ? 1 : 0) + (selectedTags.length > 0 ? 1 : 0)` — a max of 3. Counting each selected Feature tag individually was rejected: with up to ~145 Feature tags selectable, that count could read as an alarming number rather than a helpful one, and "how many kinds of filters are narrowing this" is the more useful signal to a visitor than "how many tags."
- Pass the new `activeFilterCount` to the existing `<FloatingFilterButton inline />` call in `MainPage.tsx` (its only current call site).

## Testing Decisions

Good tests here assert on rendered output and accessible names/roles, not on internal state or class names — consistent with this codebase's existing React Testing Library usage (e.g. `NeighborhoodPage.test.tsx`, `SignInWithEmail.test.tsx`, `shared/ui/ReviewCard.test.tsx`).

- **Navbar** (`widgets/Navbar/ui/Navbar.test.tsx`, new): render, query the hamburger by its accessible role/name (`getByRole('button', { name: /open menu/i })`), click it, assert the overlay is present and the accessible name flips to "Close menu". No existing `Navbar.test.tsx` to extend — new file, following the render-and-query pattern already used throughout the test suite.
- **NeighborhoodDropdown**: the rename is a static string; a snapshot or `getByRole('button', { name: 'Neighborhoods' })` query is enough. No new test file needed if none exists — a one-line assertion added wherever `Navbar.test.tsx` already renders the nav is sufficient, since the dropdown lives inside it.
- **EmptyFilterResults** (`features/FilterPanel/ui/EmptyFilterResults.test.tsx`, new): render, assert the `<img>` (not emoji text) is present with appropriate `alt`, and that the Reset button is present and clickable — following `shared/ui/ReviewCard.test.tsx`'s render-and-query shape.
- **Pluralization**: extend `NeighborhoodPage.test.tsx` with a case for a Neighborhood with exactly one Place, asserting the heading reads "All 1 Place in X" (this test file already sets up Neighborhood-with-N-places fixtures per its existing test titles). `AverageRating` and `NeighborhoodPlaceCard` are small enough presentational components that a direct render test per component (asserting the singular string for `ratingCount={1}` and the plural string for `ratingCount={2}`) is more direct than routing through a page-level fixture — new small test files for each if none exist.
- **FilterPanel loading state**: a render test asserting the `Spinner` (by test id or role, matching how `ImgWithLoader`'s existing usage is verified, if it has a test) appears while `loadingTags` is true, and disappears once the mocked query resolves.
- **ContactPage** (`pages/ContactPage/ui/ContactPage.test.tsx`, new): render at a mobile viewport (matching whatever viewport-mocking approach `NeighborhoodPage.test.tsx` or similar already uses, if any — otherwise a straightforward render since the heading's visibility is now CSS-only, not conditional React rendering, so this only needs to assert the heading and subtext text nodes exist in the DOM at all, not that they're specifically hidden or shown at a breakpoint, since CSS media queries aren't meaningfully testable in RTL/jsdom).
- **SignUpWithEmail / FormField hint**: extend `SignUpWithEmail`'s test coverage (or add one modeled on `SignInWithEmail.test.tsx` if none exists) asserting the hint text renders under the password field before any input, and is replaced by the error message once validation fails.
- **PlaceCard color change**: a CSS-only change: no meaningful RTL assertion (color isn't something RTL/jsdom resolves from a CSS module in a way worth asserting on) — skip a dedicated test; this is confirmed by the type-check/lint/build passing and a visual check, not a unit test.
- **FloatingFilterButton / MainPage active-filter count**: extend `MainPage.test.tsx` (already has fixtures for "shows the filtered Places at once when it opens with Filters already active") with an assertion that the filter button's accessible name includes the active count once Filters are applied, and that the badge's rendered text matches the expected count for a couple of representative combinations (e.g. only Rating active → 1; Rating + Neighborhood + a Feature tag → 3, regardless of how many tags are selected within that category).

## Out of Scope

- The Neighborhood picker's compact-grid redesign and its mobile inline-expand-in-hamburger behavior ([Navigation and IA](../ui-ux-audit/issues/03-navigation-and-ia.md), ticket 09 Tier 3 item 16) — this spec only renames the picker's label, not its layout.
- Splitting the full-screen `Loader` into heavy/light treatments, the Suggest a Place validation/visual overhaul, the Filters modal's live result-count preview and Features search/collapse, the mobile bottom-sheet build, and the backend Amenity-tag dedup — all later tiers or a separate track on [Rank every improvement decided on this map](../ui-ux-audit/issues/09-rank-candidates.md), not this spec.
- Any change to `FilterPanel`'s or `FilterFooter`'s existing `hasActiveFilters: boolean` contracts — only `FloatingFilterButton` gains a count; the boolean stays exactly as it is everywhere else it's used.
- A general pluralization utility/hook — three call sites don't justify one; follow the existing inline idiom instead.
- Any accessibility pass beyond what these ten items directly touch — this repo's `ui-ux-audit` map explicitly treats accessibility as "note it where a ticket trips over it," not a dedicated pass.

## Further Notes

- All ten items are independent of each other and of every other tier on [Rank every improvement decided on this map](../ui-ux-audit/issues/09-rank-candidates.md) — they can be built and shipped in any order, or split across separate PRs, without sequencing constraints.
- Two items (#4's icon swap, #14's card color) touch only CSS/asset references with no logic change; keep their diffs minimal and resist the temptation to refactor neighboring code while in the file.
- The `--overlay` design token used for the Navbar fix (#1–2) is already defined in `shared/styles/theme.css` — no new token needed. `FilterPanel`'s own overlay hardcodes `rgba(0,0,0,0.5)` instead of using a token; that inconsistency is pre-existing and out of scope for this spec (don't "fix" it as a drive-by).
