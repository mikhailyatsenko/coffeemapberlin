# 07: The rate block waits for the own Review of each Place

**What to build:** when a person moves from one Place to another inside the app (no full reload, the Place page stays mounted), the "Been here? Rate it" block for the new Place appears only once that Place's own Review has loaded. A returning visitor with a Rating on the new Place sees "Your rating: N · change" straight away, never the beans first ([the spec](../spec.md), user story 23). `rate_block_view` fires once per Place with the correct `has_rating` (spec, Analytics: "block first enters the viewport, once per page view"). Today the "reviews have loaded" latch is kept across Places, so the block for the new Place mounts before its own Review arrives. The latch exists so that a later refetch of the same Place (e.g. after sign-in) doesn't unmount the block and count a second view; that must keep working.

Found in the code review of `main...HEAD` (Spec axis, finding c1).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] A test reproduces in-app navigation A → B where the person has a Rating on B: the block for B doesn't render before B's own Review loads, then opens directly in the "Your rating: N · change" state
- [x] `rate_block_view` for B fires once, with `has_rating: true` and B's `place_id`
- [x] A refetch of the same Place's Review (e.g. after sign-in) still doesn't remount the block or send a second `rate_block_view`
- [x] If loading B's Review fails, the block still shows, as it does today on error
