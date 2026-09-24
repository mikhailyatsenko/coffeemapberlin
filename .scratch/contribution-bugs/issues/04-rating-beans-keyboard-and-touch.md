# Rating beans can't be used by keyboard and give no preview on touch

Status: resolved

## Problem

The clickable beans in the Rating modal are plain `<span>`s with mouse handlers only (`src/shared/ui/RatingWidget/ui/RatingWidget.tsx:37-49`). A keyboard or screen-reader user can't rate at all. On touch there is no hover, so the first tap is also the save: nothing shows which value is about to be chosen.

## Expected behaviour

- The beans form one accessible control (e.g. a radio group labelled "Rating"). Each value from 1 to 5 can be focused and chosen with the keyboard, and each is announced ("4 of 5").
- Pointer behaviour stays as it is: tap or click saves immediately, and mouse hover previews.
- The display-only uses (`isClickable={false}`, e.g. the Average rating and Neighborhood cards) are unchanged and not focusable.

## Acceptance criteria

- [x] Tab reaches the Rating control; arrow keys move and Enter/Space choose a value
- [x] Screen readers announce the control and the current value
- [x] Display-only beans are unchanged
