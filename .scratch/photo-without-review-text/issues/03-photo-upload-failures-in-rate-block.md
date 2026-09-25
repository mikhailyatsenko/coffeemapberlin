# 03: Photo upload failures in the block

**What to build:** When a Photo fails to upload from the block, the person sees why on that Photo's thumbnail, keeps the Photos that saved, and can resend just the failed one with Retry. Failures reach GA, and leaving the page cancels an upload in flight. Spec: [Photo without Review text](../spec.md), Error reasons and Analytics.

**Blocked by:** 02 ("Add a photo" in the block)

**Status:** resolved

- [x] A failed Photo shows its reason's message on its thumbnail, plus one `role="alert"` line in the block; saved Photos stay saved and counted
- [x] Each server code maps to its reason in the block (`RATE_LIMITED`, `IMAGE_LIMIT_REACHED`, too large, network, reCAPTCHA unavailable); an unreadable file fails alone while the rest upload
- [x] Retry resends only that Photo; on success it gets its checkmark and the count updates
- [x] `contribution_failed` with `kind: 'photo'`, the `reason`, `place_id` and `actor`, once per failed Photo attempt
- [x] The alert clears on the next successful upload
- [x] Unmounting the block aborts an upload in flight, with no error shown or sent for the abort
- [x] `RateBlock` tests cover each reason, partial failure, Retry, the event and the abort
