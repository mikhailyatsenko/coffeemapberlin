# Swipe hint for the places list on mobile

Status: ready-for-agent

## Problem Statement

On a phone the list of Places is a horizontal strip of cards at the bottom of the map. Each card is about as wide as the screen, so on first load a visitor sees one card and nothing tells them the strip scrolls sideways. Today the list starts shifted 60px to the right instead. That cuts off the left edge of the first card and still doesn't clearly show that the list can be swiped.

## Solution

On a phone the list starts at its left edge with the first card fully visible. About a second after the list first appears in a browser tab, it plays one short hint: it scrolls a little to the right, so the next card peeks in, then scrolls back. The hint does not play if the visitor already has a saved list position in this tab, if their system asks for reduced motion, or if they have already started using the list. Touching the list while the hint is playing stops it where it is.

## User Stories

1. As a visitor on a phone, I want the places list to hint that it scrolls sideways, so that I discover there are more Places than the one card I can see.
2. As a visitor on a phone, I want the first card fully visible when the page loads, so that I can read it without it being cut off.
3. As a visitor on a phone, I want the hint to wait a moment after the list appears, so that I notice it rather than losing it among everything else that is loading.
4. As a visitor on a phone, I want the hint to play only once, so that the list doesn't keep moving on its own and annoy me.
5. As a visitor on a phone, I want the hint to reveal part of the next card, so that I can see what is waiting off-screen.
6. As a visitor on a phone, I want the list to return to the first card after the hint, so that I'm back where I started.
7. As a visitor on a phone who comes back to the map from a Place's page, I want the list to stay where I left it without a hint, so that I don't lose my position.
8. As a visitor on a phone who reloads the tab after scrolling the list, I want my saved position restored without a hint, so that the list doesn't jump.
9. As a visitor on a phone who starts swiping before the hint begins, I want the hint skipped, so that it doesn't fight my own scrolling.
10. As a visitor on a phone who touches the list while the hint is playing, I want it to stop immediately and stay where my finger put it, so that the list never pulls away from me.
11. As a visitor who has turned on reduced motion in their system settings, I want no hint animation, so that the app respects my accessibility preference.
12. As a visitor on a desktop, I want the vertical places list to behave exactly as it does today, so that nothing changes for me.
13. As a visitor who opens the site in a new tab, I want to see the hint again in that tab, so that the hint appears on each fresh visit.

## Implementation Decisions

- Only the virtualized places list widget changes, and only in its mobile (horizontal) layout. Nothing changes on desktop.
- The existing mobile default shift (scroll to 60px when there is no saved position) is removed. With no saved position the list starts at offset 0.
- Restoring the saved scroll position from session storage (`scroll-list`) keeps working exactly as it does now, on both mobile and desktop.
- The hint plays only when all of these are true: mobile layout, no saved `scroll-list` position in session storage when the list mounts, and `prefers-reduced-motion: reduce` does not match.
- The hint starts about 1000ms after the list first renders with Places. If the list's scroll position is no longer 0 by then, the hint is skipped.
- The hint is a real scroll of the list's scroll container, not a CSS transform. It uses the native `scrollTo({ left, behavior: 'smooth' })` on the list's outer element, reached through react-window's `outerRef`. It scrolls to 80px, then after about 400ms scrolls back to 0.
- A `touchstart` or `pointerdown` on the list during the hint cancels whatever part of the hint hasn't run yet: the return to 0 does not happen and the list stays where the user put it.
- All hint timers and listeners are cleaned up on unmount.
- The scroll events the hint causes go through the existing debounced save of the position. That's acceptable: the hint ends back at 0, and an interrupted hint leaves wherever the user actually scrolled.
- Suggested values: offset 80px, start delay 1000ms, pause before the return 400ms. They are local constants of the widget.

## Testing Decisions

- A good test renders the component and checks only what the user can observe: where the list is asked to scroll and when. It doesn't reach into internal state, refs or hook structure.
- One test seam: the `VirtualizedList` component rendered at mobile width. The tests use fake timers, a stubbed `matchMedia` for `prefers-reduced-motion`, controlled `sessionStorage`, and a spy on `scrollTo` of the rendered scroll container.
- Cases to cover:
  - First load on mobile: the list is not moved to 60px. After the delay it scrolls to 80px smoothly, then back to 0.
  - A saved `scroll-list` position: the saved position is restored and no hint plays.
  - Reduced motion: no hint plays.
  - Desktop width: no hint plays.
  - The list is already scrolled away from 0 when the delay ends: no hint plays.
  - `touchstart`/`pointerdown` after the hint starts: no scroll back to 0.
  - Unmount before the delay ends: no scroll calls afterwards.
- Prior art: `SearchPlaces.test.tsx` (vitest + Testing Library, stubs browser APIs such as `visualViewport`, asserts observable behaviour).
- jsdom can't show how smooth the scroll looks. Check that on a real phone, or in mobile emulation in the browser.

## Out of Scope

- Showing the hint once per device (remembering it in `localStorage`).
- Repeating or looping the hint, or showing it again after a period of inactivity.
- Visual cues other than motion, such as arrows, gradients or "swipe" text.
- Any change to the desktop list, the card size, or how the scroll position is saved.

## Further Notes

- The mobile card is 390px wide plus 16px spacing, which is wider than most phone screens. That's why the next card isn't visible on load and a hint is needed at all.
- No new domain terms, and no ADR needed: the decision is purely presentational and easy to reverse.
