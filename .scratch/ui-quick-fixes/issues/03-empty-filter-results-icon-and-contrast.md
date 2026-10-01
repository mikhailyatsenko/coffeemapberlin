# 03: Fix EmptyFilterResults' icon and Reset button contrast

**What to build:** The "no places match your filters" empty state uses the site's own SVG icon system instead of a native emoji, and its "Reset Filters" button text is clearly readable against its background.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] The 🔍 emoji is replaced with the existing `search-icon-alt.svg` asset, sized and styled to match the visual weight the emoji previously occupied.
- [x] The "Reset Filters" button's text color is `--text-inverse` (white), matching `FilterFooter`'s `.applyButton` on the same `--accent-primary` background — no longer near-black-on-orange.
- [x] Clicking "Reset Filters" still resets filters exactly as it does today.
- [x] A new `EmptyFilterResults.test.tsx` renders the component, asserts an `<img>` (not emoji text) is present, and that the Reset button is present and clickable.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §4.
