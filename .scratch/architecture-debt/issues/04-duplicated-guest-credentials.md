# 04: A Guest contribution outside the Photo change repeats the Guest credentials line

Status: needs-triage

- **Rule:** the Duplicated Code smell (code-review baseline); no documented rule in `docs/agents/architecture.md` covers it.
- **File:** `src/shared/api/hooks/useToggleCharacteristic.ts` still has `const guestCredentials = user ? {} : await ensureGuestIdentity();`. The other copies (`useOneTapRating`, `useAddPhotos`, `useSubmitReview`) now call `contributionCredentials(isSignedIn)` from `shared/lib/guest`.
- **Why it wasn't fixed in place:** `shared/api` is a slice the Photo change doesn't touch; switching it to the helper is a one-line follow-up.
