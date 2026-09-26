# 04: Place photos in a suggestion

**What to build:** on `/suggest` the visitor adds up to 10 photos of the Place (same formats and size limit as Review Photos). After the suggestion is created they upload one by one, each with its own state. A failed photo is named on the thank-you and can be retried there. On the review page the admin sees the photos and can remove any. The ones left go into Publish, where they become the Place's Place photos with the first as its card image.

**Blocked by:** 02, 03, backend `../coffemap-server/.scratch/place-suggestions/issues/03-suggestion-photos.md`.

**Status:** ready-for-agent

- [ ] Photo picker on `/suggest`, at most 10, formats and size as Review Photos, previews with remove before submit
- [ ] After `submitPlaceSuggestion`, photos upload one by one via `uploadPlaceSuggestionPhoto` with Guest credentials when needed; each shows uploading / done / failed
- [ ] A failed photo is named on the thank-you with a retry; Guest photo-limit errors get their own message
- [ ] The review page shows the photos in upload order with a remove control each; the remaining paths go into Publish, the first marked as the card image
- [ ] Component tests cover per-photo states and retry, and that removed photos are left out of the Publish input
