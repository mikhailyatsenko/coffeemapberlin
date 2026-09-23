# The Rating modal disappears while a Rating is saving

Status: ready-for-agent

## Problem

Tapping a bean makes the whole Rating modal disappear and a loader take its place, and then the modal comes back. It reads as a glitch, and a successful Rating gets no confirmation.

## Current behaviour

`RateNow` returns `<Loader />` in place of everything it renders, modal included, while `loadingRating` is true (`src/features/RateNow/ui/RateNow.tsx:49`). The mutation also awaits refetches of `Place` and `PlaceReviews` (`:36-42`), so the gap lasts at least two round trips, and for a first-time Guest the reCAPTCHA check comes on top.

## Expected behaviour

- The modal stays open while saving. The saving state shows inside it (e.g. beans disabled with a small spinner), and the button or trigger stays where it is on the page.
- Once saved, the modal shows the new Rating plus a short thank-you, and invites the visitor to mark Characteristics.

## Acceptance criteria

- [ ] The modal never unmounts during a Rating save
- [ ] Repeated taps during a save don't send a second mutation
- [ ] A successful save shows a visible confirmation in the modal
