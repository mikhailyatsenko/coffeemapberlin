# How many steps and where is the friction on the way to a Rating today?

Type: research
Status: resolved

## Question

Starting from a Place page and from a Neighborhood page (desktop and mobile), what does a first-time Guest have to do to leave a Rating, a Characteristic or a photo? Count the steps, note where the entry points sit (above/below the fold), what interrupts (reCAPTCHA, auth modal, form size), and anything that hides or buries them. Output: the path as a short list plus the top friction points, with file references. Local code only (`src/features/RateNow`, `RatePlace`, `AddTextReview`, `widgets/DetailedPlace`, `pages/NeighborhoodPage`).

## Answer

Full write-up: `.scratch/engagement/research/current-path-to-a-rating.md` on branch `research/current-path-to-a-rating` (code reading only; fold positions estimated from CSS).

- Place page → Rating: 3 taps ("Rate place" → modal → bean saves instantly). Characteristics: +1 tap each, same modal. No auth modal before contributing; reCAPTCHA v3 is invisible and runs once, then the Guest identity takes over.
- Photo: only via the Review text form; submit is disabled without text; a "Create account" modal follows.
- Neighborhood page: no contribution at all; beans are display-only, and only Places rated ≥ 4.5 are shown.

Top friction:
1. No photo without Review text.
2. On mobile, "Rate place" and the Review form sit below the fold (hero image and whole sidebar come first).
3. Neighborhood page hides unrated Places.
4. Dead or misleading controls: "Be first to write one" is not wired up (`ReviewList.tsx:23-33` vs `ReviewsBlock.tsx:41-47`); the big Average rating beans look clickable but aren't; rating beans have no touch preview or keyboard access.
5. reCAPTCHA failure (e.g. ad blocker) fails silently; no thank-you after a Rating; GA only sees the "Rate place" click.
