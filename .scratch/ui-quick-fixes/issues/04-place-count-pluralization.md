# 04: Fix Place-count pluralization across the site

**What to build:** Everywhere the site renders a count of Places, ratings, or reviews, a count of exactly one reads grammatically correct ("1 Place", "1 rating", "1 review") instead of the current always-plural text.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] `NeighborhoodPage`'s "All Places" heading reads "All 1 Place in X" for a Neighborhood with exactly one Place, and "All N Places in X" for any other count.
- [x] The Place page's average-rating text reads "from 1 rating" for a Place with exactly one rating, and "from N ratings" otherwise.
- [x] `NeighborhoodPlaceCard`'s review count reads "(1 review)" for a Place with exactly one review, and "(N reviews)" otherwise.
- [x] All three fixes follow the inline `` `${n} thing${n !== 1 ? 's' : ''}` `` idiom already used elsewhere in the codebase (`AddPhotos`, `PhotoThumbnails`) — no new shared pluralization utility introduced.
- [x] `NeighborhoodPage.test.tsx` gets a case for a Neighborhood with exactly one Place asserting the singular heading. The two card/rating components each get a direct render test asserting singular vs. plural output.

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §5.
