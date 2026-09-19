# 02: Swipe hint yields to the user

**What to build:** The hint never fights the visitor. If they have already scrolled the list by the time the hint is due, it doesn't play. If they touch the list while it is playing, it stops where it is and doesn't pull the list back to the start. Leaving the page before or during the hint leaves nothing behind. See the spec: `.scratch/places-list-swipe-hint/spec.md`.

**Blocked by:** 01 (Mobile places list starts at its left edge and shows a swipe hint once).

**Status:** ready-for-agent

- [ ] If the list's scroll position is no longer 0 when the start delay ends, the hint is skipped
- [ ] A `touchstart` or `pointerdown` on the list during the hint cancels the rest of it: no scroll back to 0
- [ ] On unmount, all hint timers and listeners are cleaned up, and no `scrollTo` calls happen afterwards
- [ ] Component tests at mobile width cover these three cases alongside the tests from 01
