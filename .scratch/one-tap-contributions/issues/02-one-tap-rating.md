# 02: One-tap Rating as its own component

**What to build:** the one-tap Rating from [the spec](../spec.md): beans that save a Rating on one tap, for Users and Guests alike. The Rating shows at once (optimistic); a failure reverts to the previous Rating (or none) and shows the reCAPTCHA-blocked or network message. A Guest's first tap creates the Guest identity through the invisible reCAPTCHA (ADR 0001). The Place and Place reviews refetch in the background, not awaited. The component takes the Place id and the person's current Rating and tells its caller when a Rating is saved. It must work without the Place page's queries, since Shortlist and Quiz cards will use it later. It's exported from the RateNow feature's public API.

To make it visible now, it replaces `RatePlaceWidget` inside the existing "Rate place" modal: rating in the modal becomes instant.

**Blocked by:** 01 (`trackEvent` in shared/lib).

**Status:** resolved

- [x] A tap on a bean sends `addRating` (with Guest credentials when there is no User) and the chosen Rating shows before the server answers
- [x] A failed save reverts the Rating and shows the reCAPTCHA or network message as an alert; the next successful save clears it
- [x] `rating_saved` fires once per confirmed save with `place_id`, `actor`, `rating`, `is_change`; `contribution_failed` fires with `kind: rating` and `reason: recaptcha | network`
- [x] Beans stay keyboard-reachable and the selected bean stays visibly selected on touch
- [x] A test renders the component with no Place in the Apollo cache and it still saves and rolls back
- [x] The modal's Rating uses this component; the existing RateNow tests are updated and green
