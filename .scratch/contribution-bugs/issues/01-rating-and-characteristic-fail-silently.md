# Rating and Characteristic taps fail silently

Status: resolved

## Problem

When saving a Rating or a Characteristic fails, the visitor sees nothing: no error, no retry. The tap looks like it did nothing. The likeliest trigger is a Guest whose ad blocker blocks reCAPTCHA: `ensureGuestIdentity()` throws before the mutation is sent (`src/shared/lib/guest/guestIdentity.ts:42-44`, `src/shared/lib/recaptcha/executeRecaptcha.ts:64-68`). A network or server error has the same effect.

Scenario: a Guest with uBlock opens a Place, taps "Rate place" and taps the 4th bean. The modal flashes and shows no Rating, and nothing explains why. The Guest leaves thinking the site is broken.

## Current behaviour

- `onSubmitRating` in `src/features/RateNow/ui/RateNow.tsx:31-43` has no `try`/`catch`. A thrown `ensureGuestIdentity()` or `addRating` error becomes an unhandled promise rejection.
- `toggleChar` in `src/shared/api/hooks/useToggleCharacteristic.ts:58-69` logs the error (the message wrongly says "Error toggling favorite") and rethrows it into the un-awaited click handler in `src/entities/RatePlace/ui/ToggleCharacteristic/ToggleCharacteristic.tsx:25-27`. Unhandled again.
- By contrast, Review text shows its errors inline (`src/features/AddTextReview/ui/AddTextReviewForm.tsx:243-247`).

## Expected behaviour

- A failed Rating or Characteristic save shows a short, visible error in the Rating modal. When the cause is reCAPTCHA failing to load, the message tells the visitor that verification was blocked (e.g. by an ad blocker) and to allow it or sign in.
- An optimistic Characteristic toggle is rolled back when it fails, so the chip doesn't stay pressed.
- No unhandled promise rejections.

## Acceptance criteria

- [x] A reCAPTCHA failure while rating shows an error in the modal, and no Rating appears as saved
- [x] A failed Characteristic toggle shows an error and the chip returns to its previous state
- [x] A server/network error on either path shows an error
- [x] The console log message in `useToggleCharacteristic` names the right action
- [x] Tests cover the failure paths
