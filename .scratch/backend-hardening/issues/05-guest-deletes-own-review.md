# 05: A Guest sees the delete control on their own Review

Status: done
Blocked by: backend coffemap-server `.scratch/backend-hardening/issues/17-guest-deletes-own-review.md` (deployed)

## Problem

The backend now lets a Guest delete (text, Rating or all of) their own Review through the Guest identity headers. The client still hides the control from anyone not signed in and shows "login required" instead.

## Current behaviour

- `src/features/ReviewList/ui/ReviewList.tsx:61`: `canDelete={Boolean(user)}`, although a Guest's own Review already comes back with `isOwnReview: true`.
- `src/shared/api/hooks/useDeleteReview.ts:114`: `handleDeleteReview` calls `showLoginRequired()` and returns when there is no User.

## Expected behaviour

- The delete control shows on a Review when `isOwnReview` is true and either a User is signed in or a Guest identity is stored (`readGuestIdentity()` from `shared/lib/guest`).
- `handleDeleteReview` sends the mutation for a Guest (the Apollo guest link adds the headers); `showLoginRequired` stays only when there is neither a User nor a Guest identity.
- Cache updates after the delete (Place stats, the Review list) work the same for a Guest as for a User.
- A `GUEST_IDENTITY_INVALID` answer is already handled by the Apollo link (credentials dropped); the delete shows the usual error.

## Acceptance criteria

- [x] Test: a Guest with a stored identity sees the delete control on their own Review and not on others'.
- [x] Test: a Guest deleting text / Rating / all sends `deleteReview` and updates the list; no login prompt.
- [x] Test: with no User and no Guest identity, the control is hidden (or the login prompt shows, as today).
- [x] Lint, type-check and tests pass.

## Comments

2026-09-30 (implement): Done on `feat/guest-deletes-own-review`.

- Added `shared/hooks/useHasProvenIdentity.ts` (`Boolean(user) || Boolean(readGuestIdentity())`) so "does this viewer own an identity" lives in one place. `ReviewList.tsx`'s `canDelete` and `useDeleteReview.ts`'s login-required guard both call it; `ReviewCard` already gates the delete icon on `isOwnReview`, so that plus this hook gives the behaviour the ticket asks for.
- `useDeleteReview.ts`: `handleDeleteReview` only shows the login prompt when `useHasProvenIdentity()` is false; otherwise it sends the mutation as before. No mutation-variable changes — the Apollo guest link already attaches `x-guest-id` / `x-guest-secret` headers to every request when an identity is stored, matching backend ticket 17.
- `ReviewCard.tsx`: updated the now-stale `canDelete` doc comment ("deleting needs an account") to describe the new rule.
- Added `ReviewList.test.tsx` (control visibility for Guest/User/neither) and `useDeleteReview.test.tsx` (Guest `deleteReviewText` / `deleteRating` / `deleteAll` update the Review list with no login prompt; login prompt with neither identity).
- `/code-review`: Standards passed (no hard violations); flagged the identity check as duplicated across the two files, fixed by extracting `useHasProvenIdentity`. Spec passed; flagged that the first test pass only covered `deleteAll`, fixed by adding the `deleteReviewText` / `deleteRating` cases.
- Left the pre-existing `updateAllPlacesCache` cache write in `useDeleteReview.ts` untested and unfixed: it calls `cache.writeQuery({ query: GetPlacesDocument, data: { places: updatedPlaces } })` with `updatedPlaces` being the bare Place array, not the `{ total, places }` shape the query expects, so it likely doesn't apply and triggers a dev-mode Apollo cache warning. This is unrelated to Guest support — the same code path runs for a signed-in User — and out of scope for this ticket; worth its own bug ticket if `averageRating`/`ratingCount` on the map turn out stale after a delete.
