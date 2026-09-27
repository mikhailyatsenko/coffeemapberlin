# 08: The photo picker is written twice

Status: needs-triage

**Rule:** Duplicated Code (smell baseline in the code-review skill); pages-first, move down once a second slice needs it (`docs/agents/architecture.md`, FSD).

**Where:** `pages/SuggestPlacePage/components/SuggestionPhotoPicker` repeats `features/AddTextReview/components/ReviewPhotoPicker`: the hidden file input, the pick handler that clears `value`, `PhotoThumbnails` with "Add more" while there is room, and the "Add photos (up to N)" button (place-suggestions ticket 04). A third copy: `pages/SuggestionReviewPage/components/KeptPhotos` (the hidden input, the pick handler, "Add photos (up to N)"), and `pages/SuggestionReviewPage/components/UploadingPhoto` repeats `PhotoThumbnails`' per-photo markup (progress bar, error overlay, failure message, Retry) inside the review page's one photo list (review-page-photos ticket 01).

**Why past the blast radius:** one picker in `shared/ui` (next to `PhotoThumbnails`) means moving a feature's private component across layers and changing the Review form, which ticket 04 doesn't touch.
