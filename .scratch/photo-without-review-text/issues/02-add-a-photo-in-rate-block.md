# 02: "Add a photo" in the "Been here? Rate it" block

**What to build:** Once a person has a Rating, the block offers "Add a photo". A tap opens the device's picker; the chosen Photos upload straight away to the Review the Rating created, with no Review text and no "Create account" modal. Thumbnails with progress stay in the block for the page view, "N photos added" confirms, and the Photos show on the person's own Review card. Spec: [Photo without Review text](../spec.md), Button states, Data and API, Analytics.

**Blocked by:** 01 (Shared Photo thumbnails and upload)

**Status:** ready-for-human

- [x] A private `AddPhotos` sub-component of `RateNow`, rendered as its own row under the thank-you, independent of the Characteristic questions and outside the thank-you container
- [x] Button states as in the spec's table: not shown without a Rating; disabled while the first Rating saves; gone when it fails; shown for a returning Rating, while changing it, with or without Review text; not shown at 10 Photos; disabled while a batch uploads
- [x] The one-tap Rating reports the saved Review id along with the Rating; the block uploads to that id, else to the own Review's id
- [x] `RateBlock` takes the own Review's id and Photo count; `DetailedPlace` passes them
- [x] The file input accepts images, allows several, and has no `capture` attribute (library or camera on phones)
- [x] Upload starts on picking; thumbnails show progress then a checkmark; "N photos added" in a `role="status"` region; "Add more" while the Review has room; files beyond the room dropped with "Only N more fit; the rest weren't added"
- [x] After a batch settles, `PlaceReviews` refetches in the background; no "Create account" modal for Guests; Guest credentials from `ensureGuestIdentity` (reuses the identity)
- [x] The Review text link reads "Add a few words"
- [x] `photo_button_click` on "Add a photo" / "Add more"; `photos_uploaded` with `count` and `had_text` when a batch saves at least one Photo; both with `place_id` and `actor`
- [x] `RateBlock` tests cover the states, the upload with the right Review id and Guest credentials, the confirmation, the dropped-files message, the events, the renamed link and no modal
- [ ] Manual check at phone width: layout, and the picker offering the camera

**Left for a human:** the manual check at phone width (layout, the native picker offering the camera) can't be automated.

## Comments

- 2026-09-26, after code review: layout checked in Chrome DevTools at 375×812 (thumbnails, "N photos added", the dropped-files line, the error line) — fine. The native picker offering the camera still needs a real phone.
