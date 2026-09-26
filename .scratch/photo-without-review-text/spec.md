# Spec: Photo without Review text

Status: ready-for-human
Map: [Engagement: what to build so people interact more with the site](../engagement/map.md). Rank: #4 in [Rank the candidates into the final list](../engagement/issues/07-rank-candidates.md). Builds on: [One-tap contributions](../one-tap-contributions/spec.md) (in production since 2026-09-25).

## Problem Statement

A person who has just rated a Place in the "Been here? Rate it" block often has a photo of it on their phone, but the only way to add one is the Review text form. The form won't submit without Review text, so a Photo costs writing a review first. As a result almost no Place has a Photo from a User or Guest (2 Places in total). The form's picker also counts only the files picked right now, not the Photos the Review already has, so a person with 4 Photos who picks 10 more sees 4 of them fail with a vague "Some photos could not be uploaded". And if one picked file can't be read, for example a HEIC photo on a desktop browser, the whole selection silently disappears.

## Solution

Once the person has a Rating, the block offers "Add a photo". A tap opens the device's picker, and the chosen Photos upload straight away to the Review that the Rating created. No Review text is needed, and no "Create account" modal follows. Thumbnails with progress stay in the block for the rest of the page view, a "N photos added" line confirms the result, and the Photos appear on the person's own Review card. Failures are shown per Photo with a reason and a Retry. The block's Review text link becomes "Add a few words", because the Photo now has its own button.

The Review text form gets the same picker and upload code: its limit counts the Review's existing Photos, and an unreadable file marks only itself.

The feature ships with GA events, a baseline and a success threshold (see Further Notes).

## User Stories

1. As a visitor who has just rated a Place, I want an "Add a photo" button in the block, so that I can share a picture without writing a review.
2. As a visitor, I want "Add a photo" to appear as soon as I have a Rating, regardless of the Characteristic questions, so that skipping or answering them doesn't hide it.
3. As a visitor who hasn't rated, I want no "Add a photo" button, so that the block keeps asking only "Been here?" first.
4. As a visitor whose Rating is still saving, I want the button visible but disabled, so that I know it's coming and can't upload to a Review that doesn't exist yet.
5. As a visitor whose Rating failed to save, I want the button to disappear with the Rating, so that I'm not offered to attach a Photo to nothing.
6. As a returning visitor who already has a Rating, I want "Add a photo" on arrival, so that I can add a Photo on a later visit.
7. As a visitor who is changing their Rating, I want "Add a photo" to stay available, so that changing my score doesn't cost me the option.
8. As a visitor who already wrote Review text, I want "Add a photo" in the block too, so that I can add pictures without opening the edit form.
9. As a visitor, I want the tap to open my device's photo picker (library or camera) directly, so that adding a Photo is one choice, not a form.
10. As a visitor, I want to pick several Photos at once, so that I don't repeat the flow per picture.
11. As a visitor, I want the upload to start as soon as I confirm the picker, so that there is no second "Upload" step.
12. As a visitor, I want a thumbnail with progress for each Photo, so that I see what is uploading and how far along it is.
13. As a visitor, I want a checkmark on each saved Photo and "N photos added", so that I know they counted.
14. As a screen-reader user, I want "N photos added" and upload errors announced, so that I know the result without seeing the thumbnails.
15. As a keyboard user, I want to reach "Add a photo", "Add more" and "Retry" with Tab and activate them with Enter or Space, so that I can add Photos without a mouse.
16. As a visitor, I want "Add more" under the thumbnails while my Review has room, so that I can add another batch.
17. As a visitor whose Review already has 10 Photos, I want no "Add a photo" button, so that I'm not offered something that will fail.
18. As a visitor who picks more Photos than my Review has room for, I want the extra ones dropped with "Only N more fit; the rest weren't added", so that I know why some weren't taken.
19. As a visitor on a flaky connection, I want a failed Photo to show an error on its thumbnail and a Retry, so that I can resend just that one.
20. As a visitor whose upload partly failed, I want the Photos that saved to stay saved, so that one bad file doesn't cost me the others.
21. As a visitor who picked a file the browser can't read (e.g. HEIC on desktop) or one that is too large, I want that thumbnail to say "This photo couldn't be read, try a JPEG or PNG", so that I know what to do.
22. As a visitor who picked one unreadable file among good ones, I want the good ones to upload anyway, so that I don't lose my whole selection.
23. As a Guest who uploaded many Photos quickly, I want "Too many photos for now, try again later" when I hit the limit, so that I know it's temporary.
24. As a visitor whose Review reached 10 Photos on the server in the meantime, I want "This review already has 10 photos", so that I understand the rejection.
25. As a Guest whose Guest identity was lost and whose reCAPTCHA is blocked, I want the existing reCAPTCHA message, so that I know to allow it or sign in.
26. As a Guest, I want my Photo to upload under the Guest identity my Rating created, with no captcha again, so that it stays one tap.
27. As a Guest, I want no "Create account" modal after adding Photos, so that the flow stays as light as the Rating.
28. As a visitor, I want my Photos to appear on my own Review card after upload, so that the page is consistent.
29. As a visitor with a Rating and Photos but no Review text, I want my Review card to show my Rating and my Photos, so that my contribution is visible to others.
30. As a visitor who leaves the page mid-upload, I want the upload cancelled, so that nothing keeps running in the background.
31. As a visitor, I want the block's Review text link to read "Add a few words", so that it no longer promises a Photo the button already offers.
32. As a visitor writing Review text for a Review that already has Photos, I want the form's picker to count those Photos, so that I'm never offered more than the Review can hold.
33. As a visitor using the Review text form, I want one unreadable file to mark only itself, so that the rest of my selection survives.
34. As a Guest who later signs in, I want my Photos claimed along with the rest of my Review, so that nothing is lost.
35. As the owner, I want GA events when "Add a photo" is tapped, when a batch finishes (how many saved, whether the Review had text) and when a Photo fails and why, so that I can see the funnel from Rating to Photo.
36. As the owner, I want a written baseline and success threshold for eight weeks after release, so that I can decide whether Photos are worth more work.
37. As a developer, I want the thumbnail grid and the upload in shared modules used by both the block and the Review text form, so that the two never drift apart again.

## Implementation Decisions

**Modules**

- **Shared Photo thumbnails (`shared/ui`)**: the thumbnail grid moved out of the `AddTextReview` feature's private `UploadReviewImages`. Purely presentational: thumbnails, progress, saved checkmark, per-Photo error, remove-before-upload (used only by the form), Retry, "Add more". No data imports.
- **Shared Photo upload (`shared/lib`)**: the upload moved out of `AddTextReview`, plus the client-side downscale. Uploads one Photo per `uploadReviewImage` call, sequentially, reports per-Photo progress, saved and failed states, takes an `AbortSignal`, and never rolls back a saved Photo. It must use the Apollo client from React context (the generated mutation hook or `useApolloClient`), not the module-level client, so tests can mock it with `MockedProvider`. It also takes the Review's current Photo count and drops files beyond 10 − count, reporting how many were dropped. A file that fails to decode or downscale becomes a failed Photo with reason `unreadable`. It no longer clears the whole selection.
- **Error reasons**: the save-error mapping gains `rate_limited` (server code `RATE_LIMITED`), `limit_reached` (`IMAGE_LIMIT_REACHED`) and `unreadable` (client decode/downscale failure or server `BAD_USER_INPUT` "too large"), next to `recaptcha` and `network`. Messages:
  - `network`: the existing message;
  - `recaptcha`: the existing message;
  - `rate_limited`: "Too many photos for now, try again later";
  - `limit_reached`: "This review already has 10 photos";
  - `unreadable`: "This photo couldn't be read, try a JPEG or PNG".
- **`RateNow` feature**: a new private `AddPhotos` sub-component in the block. The block renders it as its own row under the thank-you, independent of the questions, not inside the thank-you container (that stays reserved for Visits).
  - `RateBlock` gets two new props: the own Review's id (if any) and its Photo count.
  - The one-tap Rating reports the saved Review id alongside the Rating (`addRating` already returns `reviewId`), so the block can use it before the Place reviews refetch.
  - The Review id comes from that save, else from the own Review. The Review text link text changes to "Add a few words".
- **`AddTextReview` feature**: uses the shared thumbnails and upload. It keeps its preview-then-submit flow and remove-before-upload, and gains the existing-Photo count in its limit.
- **`DetailedPlace` widget**: passes the own Review's id and Photo count to the block.

**Button states**

| Person's state | "Add a photo" |
|---|---|
| No Rating | not shown |
| First Rating saving | shown, disabled |
| Rating failed to save | not shown (goes with the Rating) |
| Rating exists (incl. while changing it, with or without Review text) | shown |
| Review has 10 Photos | not shown |
| Batch uploading | disabled; "Add more" appears after the batch settles if there is room |

**Data and API** (no backend change)

- `uploadReviewImage` (`reviewId`, base64 `fileBuffer`, Guest credentials) already accepts any Review its owner has and never checks for Review text.
  - The server caps a Review at 10 Photos and a decoded file at 3 MB.
  - It rate-limits Guests to 20 Photos an hour per IP.
  - Guest credentials come from `ensureGuestIdentity`, which reuses the identity the Rating created.
- After a batch settles, `PlaceReviews` is refetched in the background so the own Review card shows the Photos. The block's thumbnails stay for the page view.
- On unmount the upload is aborted, as the form does today.
- `placeReviews` returns Reviews with a Rating or Review text. `ReviewCard` shows a Review's Photos with "Rated: N" when there is no text, but it used to render nothing at all without text; it now renders when there is Review text or at least one Photo. A Rating alone still shows no card.

**Guest flow:** unchanged from ADR 0001. No "Create account" modal after Photos. No moderation: the barrier was already one character of Review text, and the Guest rate limits bound abuse.

**Analytics:** through `trackEvent`, each with `place_id` and `actor`.

| Event | When | Extra params |
|---|---|---|
| `photo_button_click` | "Add a photo" or "Add more" tapped in the block | none |
| `photos_uploaded` | a batch settles with at least one saved Photo | `count` (saved), `had_text` |
| `contribution_failed` | a Photo fails | `kind: 'photo'`, `reason` (`network` / `recaptcha` / `rate_limited` / `limit_reached` / `unreadable`) |

No event per file. The Review text form sends no new events.

## Testing Decisions

- Good tests drive the UI the way a person does: they pick files with `userEvent.upload`, assert what is on screen and what reaches the network, and never assert hooks, state or cache internals.
- **Main seam: the block**, in the existing `RateBlock` test with `MockedProvider`, the Place-from-cache harness, and mocks for `ensureGuestIdentity`, `trackEvent` and the image downscale (jsdom has no `createImageBitmap` or canvas). Cover:
  - no button without a Rating; disabled while the first Rating saves; gone when it fails; shown for a returning Rating, while changing it, and with Review text; gone at 10 Photos;
  - picking files sends one `uploadReviewImage` per file with the Review id from `addRating` (or the own Review) and Guest credentials, then shows the saved checkmarks and "N photos added";
  - picking more than the room left drops the extras and says "Only N more fit; the rest weren't added";
  - a failed Photo shows its reason on its thumbnail, keeps the saved ones, and Retry resends only it; each server code maps to its reason; an unreadable file fails alone;
  - `photos_uploaded` and `contribution_failed` (`kind: 'photo'`) fire once with the documented params; `photo_button_click` fires on tap;
  - no "Create account" modal after a Guest's Photos;
  - the Review text link reads "Add a few words".
- **Second seam: the Review text form**, in a new test file with the same mocks. Cover only the limit counting existing Photos and an unreadable file failing alone.
- The shared thumbnails and upload are covered through these two seams and get no tests of their own.
- **Not automated:** the native picker offering the camera on phones, and the block layout at phone width. Check them by hand in the browser.

## Out of Scope

- Removing a single Photo after upload, for anyone: no mutation exists, Guests can't delete anything, and Users can only delete the whole Review. This is a known limitation and a follow-up (a backend `deleteReviewImage` with renumbering), to build only if the success check says Photos are worth it.
- Photos on Shortlist or Quiz cards.
- Any backend change, including per-Photo timestamps.
- Moderation of Photos.
- Changing how `ReviewCard` shows Photos.

## Further Notes

**How success is measured**

- **Ground truth is the database.** Photos carry no date of their own (the Review's date follows Review text and Rating), so take a snapshot instead of a monthly count. On release day and eight weeks later, count User and Guest Reviews with at least one Photo and the total of their Photos, with a read-only query against production.
- **Baseline:** Photos from Users and Guests exist on 2 Places in total.
- **It works** when, over the eight weeks:
  - at least 3 new Reviews with Photos appear;
  - there is at least one new Review with Photos for every 5 new Ratings;
  - `contribution_failed` with `kind: 'photo'` is under 15% of Photo attempts.
- **Where it breaks, from the GA funnel:**
  - `rating_saved` → `photo_button_click` low: the button isn't noticed;
  - `photo_button_click` → `photos_uploaded` low: the picker or the upload is the problem, and `contribution_failed` reasons say which.
- **Below 1 new Review with Photos in eight weeks:** don't develop Photos further, and don't build single-Photo removal.
- The window runs from this feature's own release. It may overlap the One-tap contributions check (~2026-11-20), but Photos don't change the Rating count that check uses.

**Rough cost:** ~1.5–2 days, frontend only: moving the thumbnails and upload to shared with context-client and per-Photo failures, `AddPhotos` in the block with its states and events, error reasons, the form's limit fix, and tests.
