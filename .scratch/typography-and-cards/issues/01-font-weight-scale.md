# 01: Give the site a font-weight scale: light, regular, medium

**What to build:** Text gets a real weight hierarchy across the site. Headings (`h1`–`h4`) render at medium (500) instead of the flat 200. Body text stays light (200), the brand's look. Small and meta text on the Place cards and Review cards renders at regular (400), so it no longer reads as a hairline at 12–14px. The 400 face is actually loaded, so "regular" renders as 400 instead of falling through to 500. The scale is three theme tokens, and stylelint allows `font-weight` only through them, so the remaining ad hoc weights move onto the scale whenever their file is committed. See [spec](../spec.md), Implementation Decisions (Weight scale) and Testing Decisions (Browser check).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] ~~The theme defines `--font-weight-light: 200`, `--font-weight-regular: 400` and `--font-weight-medium: 500` in their own commented group. The comment gives each token's role and the old-value→step mapping table from the spec.~~ Amended: two tokens, `--font-weight-light: 200` and `--font-weight-medium: 500`; see Comments.
- [x] `body` uses the light token and `h1`–`h4` use the medium token. Font sizes and the `*` selector stay as they are.
- [ ] ~~Roboto Slab latin 400 (v35, woff2) is self-hosted beside the 200 and 500 files, with its own `@font-face` (`font-display: swap`) and a `preload` link in `index.html`. No other faces are added.~~ Dropped: the site keeps two faces; see Comments.
- [x] The stylelint config has `declaration-property-value-allowed-list` for `font-weight`, at error level, allowing only `var(--font-weight-light|medium)` (amended) and `inherit`. A hand-made off-scale `font-weight: 600` in a scratch file fails it; that file is not committed.
- [x] The stylesheets of MainPage's Place card, the NeighborhoodPage Place card, the map popup card and the Review card are on the tokens. Names and titles use medium. Address, description, counts, dates and the Google-review note use regular. Every other weight in those files is converted by the mapping table. Amended: the meta text uses medium.
- [x] Other stylesheets are left alone unless this ticket commits them. Every committed `.scss`/`.css` file passes stylelint, and no new `stylelint-disable` is added.
- [x] Browser check through chrome-devtools MCP against the prod API, light theme only, at 1440×900 and 390×844. Take before (main) and after (branch) screenshots of every page listed in the spec, and compare the overflow-script output on each. Expected differences: heavier headings and card meta text, lost synthetic bold in converted files, and `font-weight: 400`/`normal` that isn't converted yet becoming slightly lighter. No other differences. The Network panel shows the 200, 400 and 500 woff2 files loading once each, and `document.fonts.check('400 12px "Roboto Slab"')` is true.
- [x] `npm test`, `npm run lint:ts` and the type check pass.

## Comments

**2026-10-05, implementation.** Amended during implementation at the user's call: the site keeps **two faces, 200 and 500**, as before, for web vitals. No 400 face, no third preload, and no `--font-weight-regular` token. The scale is two steps, `--font-weight-light: 200` and `--font-weight-medium: 500`; 400/`normal` map to medium (no visible change, 400 already rendered as 500), and the card meta text (address, description, counts, dates, the Google-review note) uses medium. The stylelint rule allows `var(--font-weight-light|medium)` and `inherit`. The criteria above are checked against this amended scale; the 400-face criterion and the `document.fonts.check('400 …')` step are dropped.

Also fixed here: the heavier `h4` made "Café Magic Bitte | Specialty Coffee" 2px wider than its box on MainPage desktop, below the hardcoded 258px marquee threshold, so it was clipped. `PlaceCard` now measures the name against its own box (`useNameOverflow`) instead of the hardcoded 198/258px.

Browser check (local dev through a CORS proxy to the prod API, light theme, 1440×900 and 390×844, signed out, so Profile and My reviews show the sign-in redirect): no page scrolls horizontally before or after; the only new overflow is that name, now scrolling. Only the 200 and 500 woff2 files load, once each.
