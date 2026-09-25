# 04: Every Guest contribution repeats the Guest credentials line

Status: needs-triage

- **Rule:** the Duplicated Code smell (code-review baseline); no documented rule in `docs/agents/architecture.md` covers it.
- **Files:** `const guestCredentials = user ? {} : await ensureGuestIdentity();` appears in
  - `src/features/RateNow/model/useOneTapRating.ts`
  - `src/features/RateNow/components/AddPhotos/model/useAddPhotos.ts`
  - `src/features/AddTextReview/model/useSubmitReview.ts`
  - `src/shared/api/hooks/useToggleCharacteristic.ts`
- **Why it wasn't fixed in place:** one helper in `shared/lib/guest` (e.g. `credentialsFor(user)`) means editing slices across features and `shared/api`; that is past the blast radius of `.scratch/photo-without-review-text/issues/02-add-a-photo-in-rate-block.md`, which only adds the `AddPhotos` copy.
