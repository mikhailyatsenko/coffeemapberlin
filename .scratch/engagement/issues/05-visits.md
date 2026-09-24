# What is a Visit and what does it give the visitor?

Type: grilling
Status: resolved

## Question

"Been there", distinct from Favorite ("want to come back"). Can Guests mark Visits, and are they claimed on sign-in like Favorites? Is marking a Visit a natural moment to ask for a one-tap Rating? What does progress look like (e.g. "7 of 23 in Friedrichshain-Kreuzberg") and where is it shown? Settle the term in `CONTEXT.md`. Rough cost included.

## Answer

Decided in a grilling session, 2026-09-24. Fact check: `../coffemap-server/src/models/Interaction.ts` keeps one document per person and Place (Rating, Review text, Characteristics, `isFavorite`); My Reviews is a User-only page; Favorites show on the map via a floating button. New term in `CONTEXT.md`: **Visit**.

**What a Visit is:** a Place the person has their own Review for (Rating, Review text or Characteristics, any of them). Not a separate mark: no "Been here" button next to "Been here? Rate it", so the two don't compete and every Visit is a contribution. A Favorite alone is not a Visit; Google reviews don't count. No model change, ADR 0001 unchanged.

**Guests:** have Visits like Users; Claim moves them with the Reviews, under the existing rule (a Guest Review for a Place the User already reviewed stays anonymous).

**Progress**, denominator = all visible Places in the Neighborhood (not only those the Neighborhood page lists):
- Place page: in the thank-you after a contribution in the "Been here? Rate it" block, "Thanks! That's 4 of 41 in Mitte", from the first Review on. Not shown for Places without a Neighborhood.
- Neighborhood page: "You've been to 3 of 41 Places in Mitte" (hidden at 0), and a "Been here" badge on visited Place cards.

**Quiz result card:** a visited Place shows "You've been here · 4" instead of "Rate it". Ranking unchanged; visited Places are not excluded.

**Not in this feature:** a "not visited" Filter / "See the 38 you haven't tried", a "Been there" layer on the main map, a "My places" page with all 12 Neighborhoods. Useful mostly to locals; parked as fog.

**Rough cost:** ~3–4 days. Backend ~1–1.5: a progress query for a User or Guest (by Guest identity) returning visible-Place counts per Neighborhood and the person's reviewed Place ids. Frontend ~2–2.5: thank-you line, Neighborhood page line and badges, Quiz card state, cache update after a Rating. The thank-you line rides on the one-tap contributions block; built before it, add ~1 day.
