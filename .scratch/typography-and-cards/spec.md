Status: resolved

# Typography and cards: a weight scale and an honest rating on MainPage cards (items 14 and 13 of the ui-ux-audit map)

Source: [Rank every improvement decided on this map](../ui-ux-audit/issues/09-rank-candidates.md), Tier 2 items 14 and 13. Decisions drawn from [Visual identity and typography](../ui-ux-audit/issues/04-visual-identity-and-typography.md) (decisions 2 and 4; decisions 1 and 5 keep the Roboto Slab typeface and the accent color as they are), plus the choices confirmed with the user while writing this spec: weight tokens enforced by stylelint, a real 400 font face, and the test seams in Testing Decisions. Frontend only.

## Problem Statement

**The text has no weight hierarchy (item 14).** The whole site sets one typeface, Roboto Slab, and `body` sets weight 200; `h1`–`h4` are pinned to 200 as well. (The universal `*` selector only sets the font family; the weight is inherited from `body`.) So a heading differs from body text by size only, and small text — a card's address, a review count, a date — is a 200-weight hairline at 12–14px that reads thin and low-contrast. Components patch this one by one with their own `font-weight` values: about 100 declarations across the `.scss` files using 100, 200, 300, 400, normal, 500, 600, 700 and bold, with no shared scale. On top of that, `index.html` loads only two faces, 200 and 500, so most of those values don't render as written: 300 and 100 fall back to 200, 400 renders as 500, and 600/700/bold render as the browser's synthesized bold over 500. The "scale" a reader of the CSS sees isn't the one a visitor sees.

**MainPage cards' rating says too little (item 13).** A Place card in MainPage's list shows five coffee beans, filled to the Average rating, and next to them the bare number as the server sends it ("4.8", but "4" or "5" for whole values). It doesn't say how many Ratings stand behind it. On the live data almost every Place sits between 4.0 and 5.0 from five or six Ratings, so the bean rows look the same on every card and a visitor can't tell a well-supported 4.8 from a single 5. NeighborhoodPage's cards already do better: beans, the number to one decimal, and "(5 reviews)", or "No ratings yet — be the first" when there are none. MainPage's list doesn't even fetch the count today.

## Solution

1. **A three-step weight scale** — light 200, regular 400, medium 500 — defined once as theme tokens and used for every `font-weight` in new and touched styles. Headings (`h1`–`h4`) default to medium; body text stays light, the brand's look; small and meta text in cards uses regular.
2. **The 400 face is actually loaded**, next to 200 and 500, so "regular" renders as 400 instead of falling through to 500.
3. **Stylelint allows `font-weight` only through the scale's tokens.** Any `.scss` file a change commits must have its weights on the scale, so the ad hoc overrides converge "as they're touched" mechanically, with a fixed mapping from old values to steps.
4. **MainPage Place cards show the rating as NeighborhoodPage cards do:** beans, the Average rating to one decimal, and the number of Ratings; "No ratings yet — be the first" when there are none. One shared presentational component renders this row on both cards.

PlacePage keeps its own rating block. No backend change: `ratingCount` already exists on every Place.

## User Stories

1. As a visitor scanning any page, I want headings to be visibly heavier than body text, so that I can find the structure of the page at a glance.
2. As a visitor reading a Place card, I want the address, description and counts at a weight that stays readable at 12–14px, so that I don't squint at hairline text.
3. As a visitor, I want the site to keep its light, slab-serif character in body text, so that it still feels like the same brand.
4. As a visitor on a slow connection, I want the text to appear in the right weights without a long flash of fallback fonts, so that the page doesn't visibly reflow after loading.
5. As a visitor, I want bold-looking text to render from a real font face rather than a smeared synthetic bold, so that emphasis looks crisp.
6. As a visitor on mobile, I want headings that got heavier still to fit their containers without overflowing or clipping, so that nothing breaks on a narrow screen.
7. As a visitor on desktop, I want the layouts I know (Navbar, list, map popup, Filters modal, Place page, forms) to stay where they were, so that the weight change reads as polish, not a redesign.
8. As a developer styling a component, I want a named scale of weights to pick from, so that I don't invent a new value each time.
9. As a developer, I want the linter to tell me when a `font-weight` isn't on the scale, so that the scale holds without relying on review.
10. As a developer touching an old stylesheet for another reason, I want a fixed mapping from its old weights to the scale, so that converting the file is mechanical and predictable.
11. As a developer, I want changing the heading weight site-wide to be a one-line change, so that later typography decisions are cheap.
12. As a visitor on MainPage, I want each Place card to show its Average rating as a number with one decimal, so that "4.0" and "5.0" read the same way as "4.8".
13. As a visitor on MainPage, I want each Place card to show how many Ratings the Average rating comes from, so that I can tell a well-supported score from a single one.
14. As a visitor on MainPage, I want a Place with no Ratings to say "No ratings yet — be the first" instead of a row of empty beans, so that I know it's unrated, not rated badly.
15. As a visitor, I want "1 rating" and "N ratings" pluralized correctly, so that the count reads naturally.
16. As a visitor moving between MainPage and a NeighborhoodPage, I want the rating row on both kinds of card to look and read the same, so that I learn it once.
17. As a visitor on a narrow phone, I want the rating row to fit inside the MainPage card without wrapping awkwardly or pushing the card taller, so that the list keeps its rhythm.
18. As a visitor filtering or searching on MainPage, I want the same rating row on the cards I get back, so that filtered results aren't missing the count.
19. As a visitor viewing my Favorites on MainPage, I want those cards to show the same rating row, so that the view is consistent.
20. As a screen-reader user, I want the rating row's number and count read as text, so that I get the rating without relying on the bean pictures.
21. As a visitor on a Place's own page, I want its rating block to stay as it is, so that the hero layout doesn't change.

## Implementation Decisions

### Weight scale (item 14)

> **Amended 2026-10-05 (ticket 01):** the site keeps two faces, 200 and 500, for web vitals. There is no 400 face and no `--font-weight-regular`; the scale is light 200 and medium 500, 400/`normal` map to medium, and small/meta text that this spec puts on "regular" uses medium instead. Where the text below says regular or a 400 face, read medium and "not added".

- **Tokens in `theme.css`,** next to the color tokens, in their own commented group: `--font-weight-light: 200`, `--font-weight-regular: 400`, `--font-weight-medium: 500`. A short comment per token says its role: light for body and large text, regular for small/meta text (about 14px and below), medium for headings, labels and emphasis. No semantic aliases (`--font-weight-heading`, …) — three steps are few enough to name by weight; the role rules live in the comment.
- **Global defaults in `index.scss`:** `body` uses the light token; `h1`–`h4` use the medium token. Font sizes don't change. The `*` selector keeps setting only the family.
- **The 400 face:** add Roboto Slab latin 400 as a self-hosted woff2 in the same folder and naming scheme as the 200 and 500 files (same font version, v35, latin subset), with its own `@font-face` in `index.html`'s inline style block, `font-display: swap`, and a `preload` link like the other two — MainPage's cards above the fold use it on first paint. No variable font, no Google Fonts link, no other faces (no 600/700).
- **Stylelint rule:** the core `declaration-property-value-allowed-list` rule in the stylelint config, for `font-weight`, allowing only `var(--font-weight-light|regular|medium)` and `inherit`. It's an error, so lint-staged blocks a commit of any `.scss`/`.css` file with an off-scale weight. The token definitions themselves live as custom properties, not `font-weight` declarations, so `theme.css` passes. There is no CI and no repo-wide stylelint run, so the existing files don't fail until they're committed.
- **Mapping old values to the scale** (record this table in the comment above the tokens so the next person converting a file has it):

  | Old value | Step | Visual effect |
  |---|---|---|
  | 100, 200, 300, `lighter` | light | none — 100 and 300 render as 200 today |
  | 400, `normal` | regular | slightly lighter — 400 renders as 500 today |
  | 500 | medium | none |
  | 600, 700, `bold`, `bolder` | medium | loses the synthesized bold; no bold face is loaded |

  The mapping is the default, not a straitjacket: when a converted value is plainly a role the scale names differently (12px meta text pinned to 200 in a card), the converter may pick the role's step instead, and says so in the commit.
- **Where the boundary is ("as they're touched"):**
  - **Converted in this work:** `theme.css`, `index.scss`, `index.html`; the stylesheets of the Place cards — MainPage's `PlaceCard`, `NeighborhoodPlaceCard` and the map popup `TooltipCardOnMap` — and `ReviewCard`, with their small/meta text (address, description, counts, dates, the Google-review note) on regular and their names/titles on medium; and the new rating-summary component (below).
  - **Converted later, when touched:** every other stylesheet with a `font-weight`, including `FormField`, `Logo`, `WhiteButton`, `BadgePill`, the Filters modal, forms and pages. "Touched" means the file is committed for any reason; the stylelint rule then requires the whole file on the scale, not just the changed lines. That's deliberate: the file is the unit, and converting a whole file by the table takes minutes.
  - Inline `fontWeight` in TSX: none exists; if a later change adds one, it uses the token through `var()`.
- **Headings a component pins to light** (an explicit 200 on a heading class) stay light when converted by the table; that was a per-component design choice, and this spec doesn't override it. Headings with no override get medium from the new default — that's the main site-wide visible change.

### Rating on MainPage cards (item 13)

- **No shared component exists yet.** The number+beans+count row is inline in `NeighborhoodPlaceCard` (an entity); PlacePage's `AverageRating` (inside the `DetailedPlace` widget) is a different, hero-sized layout and stays as it is. `PlaceCard` is a feature, and a feature can't reach inside an entity's markup, so per the architecture's "move it down once a second slice needs it", extract the row into **a new `shared/ui` component, `RatingSummary`**. It's presentational with no data imports, so `shared/ui` is the right layer, and both the entity and the feature can import it.
- **`RatingSummary` interface** (narrow props, not a whole Place):

  ```ts
  interface RatingSummaryProps {
    averageRating: number | null | undefined;
    ratingCount: number;
    size?: 'small' | 'medium'; // small: MainPage's compact card; medium (default): NeighborhoodPage's card
  }
  ```

  `size` follows `BadgePill`'s existing `size` prop; it only scales the beans' and text's size, not what renders.
- **What it renders:**
  - `ratingCount > 0`: the display-only `RatingWidget` beans, the Average rating with one decimal (`4` → "4.0"), and "(N ratings)" / "(1 rating)" in a muted color on the regular weight; the number on medium.
  - `ratingCount === 0`: "No ratings yet — be the first", muted, regular weight, and no beans.
  - Inline pluralization (`!== 1 ? 's' : ''`), as elsewhere in the app.
- **"ratings", not "reviews":** `ratingCount` counts Ratings, and the glossary says not to call a Rating alone a "Review"; PlacePage already says "from N ratings". So the NeighborhoodPage card's text changes from "(5 reviews)" to "(5 ratings)" when it switches to the shared component. That's the only visible change on NeighborhoodPage from item 13.
- **`NeighborhoodPlaceCard`** replaces its inline rating section with `RatingSummary` (default size). Its props and public API don't change.
- **`PlaceCard`** replaces its `RatingWidget` + bare number with `RatingSummary size="small"`. It keeps taking `properties` whole (it renders a whole Place). The rest of the card (name marquee, favorite button, description, Neighborhood pill, address, icons) doesn't change apart from the weight conversion above.
- **Data:** add `ratingCount` to the `GetPlaces` query's `properties` and regenerate with `npm run codegen`. `FilteredPlaces` already selects it. MainPage's list, its Favorites view and its search results all come from these two queries, so every MainPage card gets the count. No schema change: `PlaceProperties.ratingCount: Int!` is filled by the `places` resolver today. Apollo normalizes `PlaceProperties` by `id`, so the extra field merges with what `FilteredPlaces` writes.
- **The map popup (`TooltipCardOnMap`)** gets only the weight conversion; it keeps its compact beans + number. It reads the same `GetPlaces` properties, so adopting `RatingSummary` there later is a one-line change.

## Testing Decisions

Good tests here assert what a visitor reads — the rating number, the count text, the no-ratings line — through rendered text and roles, not class names, bean counts or CSS. Weights and fonts can't be asserted in jsdom; they're covered by the stylelint rule and the browser check. Seams confirmed with the user:

- **`RatingSummary` gets its own RTL test** in `shared/ui` (prior art: `RatingWidget.test.tsx`): a Place with Ratings shows "4.8" and "(5 ratings)"; a whole Average rating shows "4.0"; one Rating reads "(1 rating)"; zero Ratings shows "No ratings yet — be the first" and no number; the row isn't focusable and has no radio roles (display-only beans).
- **`NeighborhoodPlaceCard.test.tsx` stays** and its expectations move from "(1 review)"/"(3 reviews)" to "(1 rating)"/"(3 ratings)" — the regression check that the entity now renders through the shared component.
- **A new `PlaceCard.test.tsx`** in `features/PlaceCard`: renders the card inside a `MemoryRouter` with `AddToFavButton` mocked out (as in the NeighborhoodPlaceCard test) and checks that a Place from the list shows its number and "(N ratings)", and an unrated one shows "No ratings yet — be the first". One or two cases; it's the check that MainPage's card is wired to `ratingCount`.
- **Fixtures typed as `GetPlacesQuery` places** (`MainPage.test.tsx`, the `PlacesList` tests and any other builder of a `GetPlaces` Place) gain `ratingCount`; `MainPage.test.tsx` otherwise passes unchanged.
- **Lint:** `npx stylelint` over the converted files passes with the new rule; a deliberately off-scale `font-weight: 600` in a scratch `.scss` fails it (checked by hand once, not committed).
- **Browser check for "nothing moved"** (chrome-devtools MCP, local dev against the prod API, light theme — the app has no dark theme):
  - Take "before" screenshots on `main` and "after" screenshots on the branch at **1440×900 and 390×844** for: MainPage (list, an open map popup, the Filters modal, the Favorites view), a PlacePage with Reviews (including a Google review), a NeighborhoodPage, Journal and one article, About, Contacts, Login and Sign up, Suggest a Place, Profile/My reviews when signed in, and the 404 page. Compare them side by side.
  - On each page, run a short script that lists elements whose `scrollWidth` exceeds their `clientWidth` and checks `document.documentElement.scrollWidth <= innerWidth`; compare the list before and after. Heavier headings are the likely source of new overflow (the Navbar, MainPage card names, card titles on NeighborhoodPage, form headings on mobile).
  - Confirm the faces: in the Network panel the 200, 400 and 500 woff2 files load once each; `document.fonts.check('400 12px "Roboto Slab"')` is true; a MainPage card's address computes to weight 400.
  - Expected differences, not regressions: headings heavier; card meta text heavier; the former 600/700/bold texts in converted files lose their synthetic bold; the MainPage card's rating row with "4.0"-style numbers and a count; NeighborhoodPage cards saying "ratings". Anything else that moved is a regression to fix or explain.
  - On the MainPage card at 390px, check the rating row stays on one line and the card's height doesn't change for rated Places.

## Out of Scope

- Changing the typeface, the accent color or the font sizes (decisions 1 and 5 of the audit's typography ticket).
- Converting every stylesheet's weights now; outside the files listed above, conversion waits until a file is touched (the stylelint rule enforces it then).
- A bold face (600/700), a variable font, or a type-size scale/tokens for font sizes.
- PlacePage's rating block (`AverageRating`) and the `HeaderDetailedPlaceCard`.
- The Favorites modal's list (it reads the `GetFavoritePlaces` query, whose `FavoritePlace` type has no `ratingCount`), the map popup's rating row, and `ReviewActivityCard`.
- The MainPage card's Place-name color (item 9, done) and any other card layout change.
- Any backend change.
- Other hardcoded style values (colors, breakpoints, the Navbar offsets) — tracked separately in [style-tokens](../style-tokens/problem.md); the weight tokens here are a first, narrow instance of that problem and don't settle its open questions.

## Further Notes

- Two tickets, independent but best in this order: **item 14 first** (tokens, the 400 face, global defaults, the stylelint rule, card weights), then **item 13** (`RatingSummary`, the query field, both cards), so item 13's new and changed stylesheets are written on the tokens from the start. If item 13 lands first, the tokens' ticket converts its files anyway.
- The audit ticket says MainPage cards always show five filled beans. The live data (408 Places, checked 2026-10-05 against the prod API) shows the beans do follow the Average rating, but nearly every Place sits at 4.0–5.0 from five or six Ratings, so the rows look alike and the count is what's missing. The fix is the same.
- With the 400 face loaded, any existing `font-weight: 400`/`normal` not yet converted (`NeighborhoodGrid`, `BadgePill`) starts rendering at a true 400 instead of 500 site-wide, independent of the stylelint rule. Watch for it in the browser check; it's an expected, slight lightening.
- `PlaceCard`'s name marquee measures the name's `scrollWidth` against hardcoded 198/258px. A medium-weight `h4` is wider, so a few more names will scroll; that's correct behavior, not a regression.
- The architecture doc's stance on lint applies: the stylelint rule is an error, and per the boy-scout rule a file that fails it gets the local fix (convert by the table), never a disable.
