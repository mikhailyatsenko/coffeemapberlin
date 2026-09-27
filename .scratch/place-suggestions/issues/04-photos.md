# 04: Place photos in a suggestion

**What to build:** on `/suggest` the visitor adds up to 10 photos of the Place (same formats and size limit as Review Photos). After the suggestion is created they upload one by one, each with its own state. A failed photo is named on the thank-you and can be retried there. On the review page the admin sees the photos and can remove any. The ones left go into Publish, where they become the Place's Place photos with the first as its card image.

**Blocked by:** 02, 03, backend `../coffemap-server/.scratch/place-suggestions/issues/03-suggestion-photos.md`.

**Status:** done

- [x] Photo picker on `/suggest`, at most 10, formats and size as Review Photos, previews with remove before submit
- [x] After `submitPlaceSuggestion`, photos upload one by one via `uploadPlaceSuggestionPhoto` with Guest credentials when needed; each shows uploading / done / failed
- [x] A failed photo is named on the thank-you with a retry; Guest photo-limit errors get their own message
- [x] The review page shows the photos in upload order with a remove control each; the remaining paths go into Publish, the first marked as the card image
- [x] Component tests cover per-photo states and retry, and that removed photos are left out of the Publish input

## Comments

- 2026-09-27: Implemented on `feat/suggestion-review-page`, on top of tickets 03 and 05. Codegen ran against the local backend at `coffemap-server` `main` (`4999aeb`): `UploadPlaceSuggestionPhoto` mutation, `photos` in `PlaceSuggestionForReview`.
- `shared/lib/photoUpload`: `UploadTarget` is now `{ reviewId } | { suggestionId }` and `usePhotoUpload` picks the mutation by it, so `/suggest` reuses the Review flow (downscaling, per-photo states, retry). `MAX_PHOTOS_PER_REVIEW` became `MAX_PHOTOS`; `limit_reached` now reads "Already 10 photos, the most allowed" for both.
- `/suggest`: `components/SuggestionPhotoPicker` in the form (Submit waits while photos downscale). `useSubmitPlaceSuggestion` creates the suggestion, shows the thank-you at once and uploads the photos there one by one with the same Guest credentials; retries reuse them. The thank-you names failed photos ("Not uploaded: …") with Retry per photo; the Guest photo limit (`RATE_LIMITED`, `guestPhoto` bucket) shows "Too many photos for now, try again later". Leaving the page aborts the uploads.
- Review page: `photoPaths` is a Publish form value, starting from `suggestion.photos`; `components/KeptPhotos` shows them in upload order with "Card image" on the first and a remove control each. `photoPaths` is always sent, since the server keeps none when it's missing.
- Checked in the browser at 390px against the local backend: picking two photos on `/suggest` shows removable previews; the review page for test suggestion `6ab8eb9f00eade1d1007d117` loads `photos` and shows "No photos, the Place keeps the default card image". No photo was uploaded, since the local server writes to the real ImageKit and database; upload, retry and the photo grid are covered by the component tests.
- Code review. Spec: no gaps. Fixed: the Review-only limit message, the abort controller now created in the effect (as in `useAddPhotos`), "Place photo" wording in shared docs. Left as they are: `SUGGESTION_NOT_PENDING` / `FORBIDDEN` on upload fall back to the generic message (only when the admin decides while photos are still uploading); a retried photo lands last on the server, so it isn't the card image even if it was picked first. Debt: `.scratch/architecture-debt/issues/08-duplicated-photo-picker.md`.
