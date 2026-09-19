# Claim moves a Guest's Favorites to the User account

Status: needs-triage

## Problem

When a Guest signs in, Claim moves their Reviews to the User account but leaves their Favorites behind. `CONTEXT.md` and ADR-0001 both say Claim moves Reviews **and** Favorites, so the code disagrees with the domain model.

Scenario: a Guest saves 5 Places as Favorites and leaves 2 Reviews, then signs up. The account gets the 2 Reviews, but its Favorites list is empty; the 5 Favorites stay only in this browser's storage and are not shown while signed in.

## Current behaviour

- Guest Favorites are a list of Place ids in `localStorage` (`guest-favorites-store`, `src/shared/stores/guestFavorites/`). They are not sent to the backend and are not tied to the Guest identity.
- After sign-in, `claimReviewsLeftAsGuest` (`src/shared/stores/auth/actions/index.ts`) calls `claimGuestReviews` (`src/shared/lib/guest/guestIdentity.ts`), which only claims Reviews.
- User Favorites live on the backend and are changed one at a time with the `toggleFavorite(placeId)` mutation.

## Expected behaviour

- After any successful sign-in (email, Google, new or existing account), every Place in the Guest's Favorites becomes a Favorite of that User.
- A Place already among the User's Favorites stays a Favorite (Claim never removes one; `toggleFavorite` must not be used blindly, as it would un-favorite it).
- Once claimed successfully, the Guest Favorites in this browser are cleared; on failure they are kept so nothing is lost.
- Claiming Favorites works even when the browser has no Guest identity (a Guest can have Favorites without ever having left a Review).

## Acceptance criteria

- [ ] Signing in with Guest Favorites adds them to the User's Favorites, with no duplicates
- [ ] Places the User had already saved remain Favorites
- [ ] Guest Favorites are cleared only after a successful Claim
- [ ] Nothing is requested when there are no Guest Favorites
- [ ] Tests cover the above

## Open questions

- Backend needs a way to add several Favorites at once idempotently (e.g. `claimGuestFavorites(placeIds)` or an `addFavorites` mutation), in `coffemap-server`.
- `CONTEXT.md` says the Guest identity proves Favorites belong to a Guest; in code Favorites don't use it. Decide whether the glossary or the code should change.

## Comments
