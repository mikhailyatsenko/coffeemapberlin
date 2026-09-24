# Rank the candidates into the final list

Type: grilling
Status: resolved
Blocked by: 03, 04, 05, 06

## Question

With each candidate specified and costed, rank 3–5 of them by expected effect on contribution and return visits versus cost, and record the rationale per feature. This is the destination.

## Answer

Decided in a grilling session, 2026-09-24. The rank is a recommended build order: each cost assumes everything above it is already built (beans from one-tap contributions, the Amenity synonym table, the "Been here? Rate it" block). Fact check for the photo: `uploadReviewImage` (`../coffemap-server`, `origin/main`) attaches a photo to any Review its owner has and never checks for Review text; `placeReviews` returns Reviews with only a Rating, and `ReviewCard` shows their photos. Only the frontend demands text (`AddTextReviewForm.tsx:277`). No new term in `CONTEXT.md`.

| # | Feature | Cost in this order | Main effect |
|---|---------|--------------------|-------------|
| 1 | [One-tap contributions](03-micro-contributions.md) | ~5–7 days, frontend only | contribution, Place page |
| 2 | [Shortlists on the Neighborhood page](06-best-in-neighborhood.md) | ~5–6 days (incl. the synonym table) | contribution, Neighborhood page |
| 3 | [Visits](05-visits.md) | ~3–4 days | return visits |
| 4 | Photo without Review text | ~1.5–2 days, frontend only | contribution (photos) |
| 5 | [Quiz](04-place-quiz.md) | ~5–7 days (synonyms and beans already built) | discovery, sharing |

Total for all five: ~20–26 days.

**1. One-tap contributions.** It removes the top friction found in [How many steps and where is the friction on the way to a Rating today?](01-current-path-to-a-rating.md): the mobile entry point below the fold, silent failures, no thank-you, and dead links. It sits on the Place page, where most search traffic lands. It is the base of the rest: its beans serve the Shortlists and the Quiz, its thank-you carries the Visit progress, and its block hosts the photo button. It is also the lowest risk: no backend work and no new data.

**2. Shortlists on the Neighborhood page.** The Neighborhood page is the second page type search traffic lands on, and today it allows no contribution at all. Cards gain a one-tap Rating and one Characteristic question, and "All N Places" finally shows unrated Places, the ones that most need a first Rating. It also makes the page more useful to someone who arrives from search. Built before the Quiz, it pays ~1 day for the synonym table, which the Quiz then reuses.

**3. Visits.** Once 1 and 2 exist it is cheap: the progress line goes into the existing thank-you, and the "Been here" badges cover every Place in the full list. It works mainly on return visits ("4 of 41 in Mitte" gives a reason to rate the next Place) and mostly for locals. At ~30–40 visitors a day few people come back, so it ranks below the two features that open contribution to every visitor.

**4. Photo without Review text.** After a Rating, the block offers "Add a photo", reusing `UploadReviewImages` against the Review the Rating created. No backend change, and no "Create account" modal, as with the other one-tap answers. Own photos are almost nil (2 Places), so this fills a real gap, but it is a second contribution from someone who has already rated, and Google review photos already cover 97% of Places. That's why it is the cheapest feature on the list but not the highest ranked. It could be taken as a quick win right after 1 if something small should ship first. It must come after 1.

**5. Quiz.** The weakest effect on contribution: people taking it are choosing where to go, so they mostly haven't been, and "Rate it" on a result card rarely applies. It also has to pull visitors away from the landing pages to `/quiz`. It is the most expensive feature even with the shared parts already built. It's worth building only if tourists and shareability matter more than contribution. Its share mechanics and taste profile are follow-ups, not part of this list.

**Remaining fog:** success metrics stay open and are a required question for the spec of whichever feature is picked. Quiz share mechanics, the taste profile, three-valued Characteristics and Visits beyond progress counts are follow-ups beyond this destination (see the map's Out of scope).
