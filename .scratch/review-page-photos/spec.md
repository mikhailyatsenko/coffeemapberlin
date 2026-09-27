# Spec: the admin's own Place photos on the review page

Status: ready-for-agent
Builds on: [Spec: Place suggestions](../place-suggestions/spec.md) and its [04: Place photos in a suggestion](../place-suggestions/issues/04-photos.md). Decision record: [ADR 0002: the admin acts through signed links](../../docs/adr/0002-admin-acts-through-signed-links.md).

## Problem Statement

When the admin reviews a Place suggestion, the only Place photos they can publish are the ones the suggester sent. Often there are none, or they are poor, while the admin has good photos of the Place or can take some. Today the admin can only remove the suggester's photos. They can't add their own, and the card image is always the first photo uploaded. So a Place gets published with no photos or bad ones, and the admin has to add photos by hand in ImageKit afterwards.

## Solution

On the review page (`/suggestions/:id/review`), while the suggestion is pending, the admin adds their own Place photos right there. Each photo uploads as soon as it's picked and shows its own state, with a retry if it fails. The suggester's photos and the admin's photos form one list. Any photo can be made the card image, and any photo can be deleted after an inline Delete/Cancel confirmation; a deleted photo is erased at once. A Place suggestion holds at most 10 photos, whoever uploaded them. Then the admin publishes as before, and every photo in the list becomes a Place photo of the new Place.

## User Stories

1. As the admin, I want to add Place photos on the review page, so that I can publish a Place with good photos in one visit.
2. As the admin, I want to pick several photos at once from my phone, so that adding them is quick.
3. As the admin, I want each photo to start uploading as soon as I pick it, so that Publish isn't held up by one big upload at the end.
4. As the admin, I want to see each photo's state (uploading, done, failed), so that I know what will go live.
5. As the admin, I want to retry a failed photo, so that a flaky connection doesn't cost me the photo.
6. As the admin, I want my photos downscaled and accepted in the same formats and size as Review Photos, so that big phone photos just work.
7. As the admin, I want my photos to appear in the same list as the suggester's, so that I see everything the Place will get in one place.
8. As the admin, I want to make any photo the card image, so that the Place's card shows the best photo, not just the first uploaded.
9. As the admin, I want the card image marked in the list, so that I know which photo the card will show.
10. As the admin, I want to delete any photo, the suggester's or mine, so that bad photos never go live.
11. As the admin, I want a Delete/Cancel confirmation right on the photo, so that a stray tap on my phone doesn't erase a photo for good.
12. As the admin, I want a deleted photo to free a slot at once, so that I can replace a suggester's poor photos when they already sent 10.
13. As the admin, I want the picker replaced by "10 photos, the most allowed. Delete one to add another" when the suggestion has 10 photos, so that I know why I can't add more.
14. As the admin, when I pick more photos than slots left, I want the first ones uploaded and told that the rest weren't, so that nothing is silently dropped.
15. As the admin, I want Publish to wait while any photo is still uploading, so that I don't publish a Place missing a photo I just added.
16. As the admin, I want a photo that failed to upload to be left out of Publish, so that a failure never blocks publishing.
17. As the admin, I want reloading the review page to show every photo already stored, including mine, so that nothing I uploaded is lost.
18. As the admin, I want the card image choice to be kept only until I publish or reload, so that nothing extra is stored for a choice Publish settles anyway.
19. As the admin, I want adding and deleting photos to refuse once the suggestion is decided, so that a Published or Rejected suggestion can't change.
20. As the admin, I want a bad link to refuse adding or deleting photos the same way it refuses everything else, so that the token stays the only authorization (ADR 0002).
21. As the admin, I want no hourly limit on my uploads, so that I can add many photos in one go.
22. As the suggester, I want my photos to count towards the same 10 as the admin's, so that the rules for a suggestion stay simple.
23. As a visitor, I want the new Place's card to show the photo the admin chose, so that the map shows the Place at its best.
24. As the admin, I want the page to stay usable at phone width, so that I can review a suggestion and take photos from my phone.

## Implementation Decisions

- Only photos change. The Publish form's fields stay as they are.
- **Backend: two new admin operations**, authorized only by the review link's token like `placeSuggestionForReview`, `findGoogleIdsForSuggestion` and Publish/Reject. A bad token and an unknown id fail the same way. Both act only while the suggestion is `pending` and fail with `SUGGESTION_NOT_PENDING` otherwise.
  - **Upload a Place photo as the admin** (suggestion id, token, file): stores the photo like a suggester's upload (same compression, same suggestion folder, same unique file name, same atomic append guarded on `pending` and the cap), with no rate limit. It returns the new photo's path, since the page needs it to place the photo in its list.
  - **Delete a Place photo** (suggestion id, token, path): the path must belong to this suggestion. It removes the path from the suggestion's `photos` and deletes the file from ImageKit. Deleting a path that is already gone succeeds, so a retried delete is safe.
- **One cap of 10 stored photos per suggestion**, shared by the suggester's and the admin's uploads. It is the existing `IMAGE_LIMIT_REACHED` rule. A deleted photo frees its slot immediately.
- The suggester's `uploadPlaceSuggestionPhoto` doesn't change.
- **Publish doesn't change.** `photoPaths` still decides the order, and its first path becomes the card image. The page now sends every stored photo in the admin's chosen order. Leftover files are still cleaned up with the folder.
- **Frontend: the review page's photo section** becomes one list of the suggestion's stored photos plus the admin's photos in flight:
  - The stored photos load from `placeSuggestionForReview`, in upload order. An uploaded photo is appended to the end.
  - "Make card image" on a photo moves it to the front of the list. That order lives only in the form and goes out as `photoPaths`.
  - The delete control opens inline Delete/Cancel on that photo. Delete calls the delete operation and takes the photo out of the list once the server confirms. A failed delete leaves the photo there and shows an error.
  - In-flight photos go through the shared photo upload flow (downscaling, per-photo states, retry), reached through a new upload target: the suggestion and its admin token. The upload flow chooses the admin mutation by that target, the same way it chooses between Review and suggestion uploads today.
  - The picker offers only as many slots as 10 minus the stored and in-flight photos. At 10 it is replaced by the note from story 13.
  - Publish is disabled while any photo is pending or uploading.
- Codegen runs against the backend once its operations land.

## Testing Decisions

- A good test drives the public surface only: GraphQL operations on the backend, and the rendered page with mocked Apollo on the frontend. It asserts outcomes (stored paths, files in the fake bucket, the Publish input, what the admin sees), not hooks or internal state.
- **Backend:** GraphQL resolver tests with the fake ImageKit bucket, prior art `tests/placeSuggestionPhotos.test.ts`:
  - an admin upload is stored and counted towards the shared 10;
  - an 11th photo is refused whoever uploads it;
  - delete removes the path and the file and frees a slot;
  - delete refuses a path from another suggestion;
  - a bad token and a decided suggestion are refused by both operations;
  - there is no rate limit on admin uploads.
- **Frontend:** the page's component test with mocked Apollo, prior art `SuggestionReviewPage.test.tsx` and ticket 04's tests:
  - admin uploads show their states and retry;
  - a finished upload joins the list;
  - Delete/Cancel works, and Delete calls the mutation and takes the photo out;
  - "Make card image" changes the `photoPaths` order in the Publish input;
  - Publish is disabled while an upload is in flight;
  - the picker gives way to the note at 10, and an over-pick uploads only the first ones.
- The shared upload hook isn't tested on its own. The page test covers the new target.

## Out of Scope

- Changing the Publish form's other fields: Amenities, opening hours and the rest.
- The admin adding a Place from scratch, without a Place suggestion.
- Editing Place photos of a Place that is already published.
- Reordering photos beyond choosing the card image. The other photos' order has no effect on the Place page.
- Undoing a deleted photo.

## Further Notes

- Deleting at once replaces ticket 04's rule that removed photos stay stored until Publish or Reject. The admin chose it so that the 10-photo cap can be freed from the page.
- The backend changes go to `../coffemap-server`. Before the first backend edit, ask whether to make it in the frontend session or hand it to a backend session (see `CLAUDE.md`).
