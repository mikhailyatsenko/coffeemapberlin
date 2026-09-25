# 06: Header button leads to the block; the modal goes

**What to build:** finishing [the spec](../spec.md). The header's "Rate place" action becomes a plain button that scrolls to the block and focuses its beans. It reads "Your rating: N" when the person has a Rating, and still fires `rate_place_click`. The "Rate place" modal, its state in the Place page, and the `RatePlace` entity parts with no remaining consumer (`RatePlaceWidget`, the `ToggleCharacteristic` chip grid) are removed. "Be first to write one" keeps focusing the Review text form whenever it is shown. Deleting a Rating is no longer offered in the block; Users delete through their own Review card, as today.

**Blocked by:** 05 ("Your marks" and the Review text link).

**Status:** resolved

- [x] The header button scrolls to the block and focuses the beans; its label reflects the person's Rating
- [x] No modal opens anywhere for rating; no dead code of the modal remains; lint passes
- [x] "Be first to write one" focuses the Review text form
- [x] Manual check on a phone-width viewport: block position, header-button scroll, "write one" link
- [x] All tests green, `ReviewsBlock` tests included
