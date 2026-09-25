# 05: "Your marks" and the Review text link

**What to build:** the last two parts of the block from [the spec](../spec.md). "Your marks" is a row of chips for every Characteristic the person has marked for this Place, all eight including those the block never asks. Each chip can be removed, which un-marks it in the Review. It replaces un-marking through the old chip grid. When no questions remain and the person has no Review text, the link "Add a few words or a photo" scrolls to the Review text form and focuses it. With Review text there is no link.

**Blocked by:** 04 (Characteristic questions in the block).

**Status:** resolved

- [x] "Your marks" lists every marked Characteristic (including free Wi-Fi, outdoor seating, pet friendly) and is hidden when there are none
- [x] Removing a chip sends the toggle, updates the counts, and fires `characteristic_removed`; a failure restores the chip with the message
- [x] Once questions run out and there is no Review text, the link appears; it focuses the Review text form and fires `review_text_link_click`
- [x] With Review text the link never appears
- [x] No "Create account" modal follows any one-tap action; the one after Review text is unchanged

**Decisions made while building:** a mark removed from "Your marks" counts like a Skip, so its question doesn't come back in this page view (the person just took that Yes back). A failed removal shows the message but sends no `contribution_failed`, which the spec keeps for a Rating or a Yes. Errors clear per part (the questions or "Your marks"), not across the whole block.
