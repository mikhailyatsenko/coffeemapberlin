# 01: Mobile places list starts at its left edge and shows a swipe hint once

**What to build:** On a phone the places list starts with the first card fully visible, with no 60px shift. About a second after the list first appears in a browser tab, it scrolls smoothly about 80px to the right, so the next card peeks in, then scrolls back to the start. A visitor who already has a saved list position in this tab gets that position back and sees no hint. So does a visitor on desktop, or one whose system asks for reduced motion. See the spec: `.scratch/places-list-swipe-hint/spec.md`.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] On mobile with no saved `scroll-list` position, the list starts at offset 0 and is never scrolled to 60px
- [x] About 1000ms after the list renders with Places, it scrolls smoothly to 80px (native `scrollTo` with `behavior: 'smooth'` on the list's scroll container), then about 400ms later smoothly back to 0
- [x] The hint plays at most once per mount
- [x] With a saved `scroll-list` position, that position is restored as before and no hint plays
- [x] With `prefers-reduced-motion: reduce`, no hint plays
- [x] On desktop (vertical list), nothing changes and no hint plays
- [x] Component tests for the places list at mobile width cover all of the above (vitest + Testing Library, fake timers, stubbed `matchMedia` and `scrollTo`; prior art: `SearchPlaces.test.tsx`)
- [x] Checked by eye on a phone or in mobile emulation: the hint looks smooth
