# 01: Give the site a font-weight scale: light, regular, medium

**What to build:** Text gets a real weight hierarchy across the site. Headings (`h1`–`h4`) render at medium (500) instead of the flat 200. Body text stays light (200), the brand's look. Small and meta text on the Place cards and Review cards renders at regular (400), so it no longer reads as a hairline at 12–14px. The 400 face is actually loaded, so "regular" renders as 400 instead of falling through to 500. The scale is three theme tokens, and stylelint allows `font-weight` only through them, so the remaining ad hoc weights move onto the scale whenever their file is committed. See [spec](../spec.md), Implementation Decisions (Weight scale) and Testing Decisions (Browser check).

**Blocked by:** None (can start immediately).

**Status:** ready-for-agent

- [ ] The theme defines `--font-weight-light: 200`, `--font-weight-regular: 400` and `--font-weight-medium: 500` in their own commented group. The comment gives each token's role and the old-value→step mapping table from the spec.
- [ ] `body` uses the light token and `h1`–`h4` use the medium token. Font sizes and the `*` selector stay as they are.
- [ ] Roboto Slab latin 400 (v35, woff2) is self-hosted beside the 200 and 500 files, with its own `@font-face` (`font-display: swap`) and a `preload` link in `index.html`. No other faces are added.
- [ ] The stylelint config has `declaration-property-value-allowed-list` for `font-weight`, at error level, allowing only `var(--font-weight-light|regular|medium)` and `inherit`. A hand-made off-scale `font-weight: 600` in a scratch file fails it; that file is not committed.
- [ ] The stylesheets of MainPage's Place card, the NeighborhoodPage Place card, the map popup card and the Review card are on the tokens. Names and titles use medium. Address, description, counts, dates and the Google-review note use regular. Every other weight in those files is converted by the mapping table.
- [ ] Other stylesheets are left alone unless this ticket commits them. Every committed `.scss`/`.css` file passes stylelint, and no new `stylelint-disable` is added.
- [ ] Browser check through chrome-devtools MCP against the prod API, light theme only, at 1440×900 and 390×844. Take before (main) and after (branch) screenshots of every page listed in the spec, and compare the overflow-script output on each. Expected differences: heavier headings and card meta text, lost synthetic bold in converted files, and `font-weight: 400`/`normal` that isn't converted yet becoming slightly lighter. No other differences. The Network panel shows the 200, 400 and 500 woff2 files loading once each, and `document.fonts.check('400 12px "Roboto Slab"')` is true.
- [ ] `npm test`, `npm run lint:ts` and the type check pass.
