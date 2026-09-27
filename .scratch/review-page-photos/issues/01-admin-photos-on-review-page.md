# 01: The admin adds, deletes and orders Place photos on the review page

**What to build:** on `/suggestions/:id/review`, while the suggestion is pending, the suggester's photos and the admin's own photos form one list.

- The admin picks photos; each uploads at once, with its own state and a retry.
- Any photo can be made the card image, and "Card image" marks it.
- Any photo can be deleted after an inline Delete/Cancel. It is then erased on the server.
- At 10 photos the picker becomes "10 photos, the most allowed. Delete one to add another".
- Publish waits for uploads in flight and sends the list in the chosen order.

See [the spec](../spec.md).

**Blocked by:** backend `../coffemap-server/.scratch/review-page-photos/issues/01-admin-photos-by-review-link.md`.

**Status:** resolved

- [x] Codegen runs against the backend with its admin upload and delete operations
- [x] Photos are picked on the review page and upload through the shared photo upload flow, with a new upload target: the suggestion and its admin token. Downscaling, formats and size are those of Review Photos
- [x] Each photo shows uploading / done / failed, and a failed one can be retried
- [x] An uploaded photo joins the end of the list; a failed one is left out of Publish
- [x] The picker offers only the slots left (10 minus stored and in-flight photos)
- [x] An over-pick uploads the first photos that fit and says the rest weren't added
- [x] At 10 photos the note replaces the picker
- [x] The delete control opens Delete/Cancel on that photo
- [x] Delete removes the photo from the list once the server confirms; a failed delete keeps it and shows an error
- [x] "Make card image" moves a photo to the front, and the Publish input's `photoPaths` follows that order
- [x] Publish stays disabled while any photo is pending or uploading
- [x] Usable at phone width
- [x] Component tests with mocked Apollo, extending the page's existing test, cover:
  - upload states and retry;
  - an uploaded photo joining the list;
  - Delete/Cancel and a failed delete;
  - the card image order in the Publish input;
  - Publish disabled during an upload;
  - the note at 10 and an over-pick
