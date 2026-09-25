# 01: Shared Photo thumbnails and upload; limit in the Review text form

**What to build:** The Photo thumbnails and the Photo upload move out of the `AddTextReview` feature into shared modules, so the "Been here? Rate it" block can use them next. The Review text form keeps working as before on top of them, with two fixes a person can see: its limit counts the Photos the Review already has, and a file that can't be read marks only itself instead of clearing the whole selection. Spec: [Photo without Review text](../spec.md), Modules and Error reasons.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] The thumbnail grid lives in `shared/ui`, presentational only (no data imports): thumbnail, progress, saved checkmark, per-Photo error text, remove-before-upload, "Add more"; an optional Retry per failed Photo (used by the block in 03)
- [x] The upload and client-side downscale live in `shared/lib`; the upload goes through the Apollo client from React context (not the module-level client), one `uploadReviewImage` per Photo, sequentially, with per-Photo progress, saved and failed states and an `AbortSignal`; saved Photos are never rolled back
- [x] The upload takes the Review's current Photo count, keeps at most 10 − count files and reports how many it dropped
- [x] Each failed Photo carries a reason: `network`, `recaptcha`, `rate_limited` (`RATE_LIMITED`), `limit_reached` (`IMAGE_LIMIT_REACHED`), `unreadable` (decode/downscale failure or server "too large"), with the messages from the spec
- [x] The Review text form uses both, passes its Review's existing Photo count, says "You can add N more" when files are dropped, and shows an unreadable file's message on its own thumbnail while the others stay
- [x] The form's submit flow is otherwise unchanged: Review text still required there, preview then submit, the "Some photos could not be uploaded" toast on a failed upload, Cancel Upload, the Guest "Create account" modal after Review text
- [x] New form test (`MockedProvider`, mocked `ensureGuestIdentity` and downscale) covers the existing-Photo limit and an unreadable file failing alone
- [x] `AddTextReview`'s `index.ts` re-exports by name (boy-scout: it's `export *` today)
- [x] Lint, typecheck and existing tests green
