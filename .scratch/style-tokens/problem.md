# Problem: layout numbers and colors are hardcoded instead of tokens

Status: needs-triage
Source: noted after backend ticket `coffemap-server/.scratch/backend-hardening/issues/23-dead-code-and-body-limit.md` closed. The user asked whether a step like "navbar height into a constant" was planned. It wasn't: no tracker in either repo covers styles.

## Problem

`src/shared/styles/theme.css` defines color tokens (`--accent-primary`, `--error`, `--overlay`, …). Nothing else is a token. Layout numbers that depend on each other are copied by hand into the files that need them. Changing the Navbar height means hunting down every offset, and the copies have already drifted.

## What is hardcoded today (snapshot 2026-10-01)

**Navbar height and the offsets derived from it.** The Navbar is `height: 60px` (`src/widgets/Navbar/ui/Navbar.module.scss:12`). Elements that sit below it use a range of different numbers:

| Value | Where |
|---|---|
| `top: 60px` | `widgets/Navbar/ui/Navbar.module.scss:101`, `:112` |
| `padding-top: 60px` | `pages/AboutPage`, `pages/NotFoundPage` |
| `padding-top: 80px` | `pages/NeighborhoodPage`, `pages/SuggestPlacePage`, `pages/SuggestionReviewPage` |
| `top: 70px` | `features/SearchPlaces/ui/SearchPlaces.module.scss:4`, `:13` |
| `margin-top: 56px` | `features/AuthIndicator/ui/AuthIndicator.module.scss:29` |
| `calc(100dvh - 90px)` | `pages/LoginPage/ui/LoginPage.module.scss:3` |
| `calc(100vh - 112px)` | `widgets/PlacesList/ui/PlacesList.module.scss:8` |

Which of these are "Navbar + a gap" and which are unrelated is unknown. Each one has to be checked in the browser.

**Breakpoints.** There are no shared values, and the copies disagree by one pixel:

- `max-width: 900px` ×18 and `min-width: 901px` ×2
- `767px` ×14 (`max-width` and `width <=`)
- `768px` ×12 (`max-width`, `width <=` and `min-width`)
- `480px` ×7
- `1023px` ×2

At exactly 768px, some rules already apply the mobile layout and others don't.

**Colors that duplicate an existing token.** Counts are rough, from a grep over `*.scss`:

- `#ff4b34` ×25 (= `--accent-primary`)
- `#fd5353` ×20 (= `--error`)
- `#fff` / `#ffffff` ×44
- `#e5e7eb` ×9, `#6b7280` ×9

Some colors have no token at all: `#919191` ×17, `rgba(0, 0, 0, 0.1)` ×17. The `FilterPanel` overlay `rgba(0,0,0,0.5)` is the one the `ui-quick-fixes` spec explicitly left out of scope.

## What the fix needs (not a design)

- One source for the Navbar height. Offsets that depend on it should be derived from it, not copied.
- Possibly shared breakpoints, though CSS custom properties don't work inside `@media`. That is a choice between SCSS variables/mixins in `shared/styles` and something else.
- Possibly replacing hardcoded colors that equal an existing token.

## Open questions

1. Scope: only the Navbar height, or also breakpoints and colors? Each can be its own ticket, or be dropped.
2. Mechanism: CSS custom properties in `theme.css` (works at runtime, but not in `@media`), SCSS variables/mixins in `shared/styles` (does work in `@media`), or both? `shared/styles` has only `theme.css` today, with no SCSS partials. Where do they go under FSD (`docs/agents/architecture.md`)?
3. Do the 70/80/90/112 px offsets mean "Navbar + gap", or are some of them independent? Does the Navbar height change on mobile?
4. Breakpoints: is the 767/768 split deliberate anywhere, or should it all collapse to a single value? Which set do we keep (480 / 768 / 900 / 1024)?
5. Colors: do `#919191` and `rgba(0,0,0,0.1)` get new tokens, or map to existing ones (`--text-secondary`, `--shadow-sm`)? Is the visual change from snapping them acceptable?
6. How do we check there's no visual regression? Screenshots at 480/768/900/1440 before and after, or something else?
