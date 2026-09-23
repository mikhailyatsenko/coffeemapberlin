# "Be first to write one" does nothing

Status: ready-for-agent

## Problem

On a Place with no Reviews, the Reviews block says "There are no reviews yet. Be first to write one". "write one" looks like a link, but tapping it does nothing.

## Current behaviour

`ReviewList` calls `setShowRateNow(true)` on click, and the prop defaults to a no-op (`src/features/ReviewList/ui/ReviewList.tsx:14, 23-33`). `ReviewsBlock` never passes it (`src/widgets/DetailedPlace/components/ReviewsBlock/ui/ReviewsBlock.tsx:41-47`). It's also a bare `<span>`, so it isn't focusable. Rare in practice: almost every Place has imported Google reviews.

## Expected behaviour

"write one" moves focus to the Review text field of the form rendered just above it (`id="review-form"`), scrolling it into view. It is a real button or link, reachable by keyboard. If the form isn't shown (the visitor already has Review text), the prompt isn't shown either.

## Acceptance criteria

- [ ] Activating "write one" by tap, click or keyboard focuses the Review text field
- [ ] The prompt is hidden when there's no form to go to
- [ ] The now-unused `setShowRateNow`/`showRateNow` props are removed from `ReviewList` if nothing else needs them
