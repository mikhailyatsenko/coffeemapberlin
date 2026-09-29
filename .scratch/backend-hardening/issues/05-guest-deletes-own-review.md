# 05: A Guest sees the delete control on their own Review

Status: ready-for-agent
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

- [ ] Test: a Guest with a stored identity sees the delete control on their own Review and not on others'.
- [ ] Test: a Guest deleting text / Rating / all sends `deleteReview` and updates the list; no login prompt.
- [ ] Test: with no User and no Guest identity, the control is hidden (or the login prompt shows, as today).
- [ ] Lint, type-check and tests pass.
