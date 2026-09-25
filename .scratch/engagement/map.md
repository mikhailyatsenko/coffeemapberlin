# Engagement: what to build so people interact more with the site

Label: wayfinder:map

## Destination

A ranked list of 3–5 features that grow contribution (Ratings, Reviews, Characteristics, photos) first and return visits second, for locals, tourists and coffee enthusiasts alike, at today's ~30–40 visitors a day. Each feature comes with a rationale and a rough cost. Picking which one to build is the user's call after the map is done.

## Notes

- Domain: `CONTEXT.md`; backend in `../coffemap-server` (see `CLAUDE.md`).
- Traffic is ~30–40 people/day, almost all from search, landing mostly on Place and Neighborhood pages. Ratings and Favorites run at about 1–2 per month each (~0.1–0.2% of visits).
- So: features must live on Place/Neighborhood pages and work for one visitor alone. Anything that needs critical mass (feeds, leaderboards, badges, comments) will look empty. Shareability and search value are a tiebreaker, not a goal.
- Constraints: no new paid APIs, no manual moderation (except approving Place suggestions), each feature buildable by one person in 1–2 weeks, frontend + backend. MailerSend is already wired up (admin emails from the contact form).
- Candidates in play: a "which Place suits you" quiz, Visits ("been there", progress per Neighborhood), one-tap micro-contributions on the Place page, "best in Neighborhood by Characteristic" lists.
- Running in parallel, not on this map: Place suggestions (`.scratch/place-suggestions/`), already decided, needs a spec, not a decision.
- Every grilling session: call the Skill tool for "grilling" and "domain-modeling".

## Decisions so far

- [How many steps and where is the friction on the way to a Rating today?](issues/01-current-path-to-a-rating.md): a Rating is only 3 taps, but on mobile the entry point is below the fold, photos require Review text, Neighborhood pages allow no contribution, and several controls are dead or fail silently.
- [How much Characteristic, Amenity and Rating data do Places actually have?](issues/02-data-coverage.md): Characteristics are on only 2% of Places, while Amenities cover 99%. So the quiz and "best of" lists must run on Amenities plus Average rating, which is essentially Google's.
- [What one-tap contributions should the Place page offer?](issues/03-micro-contributions.md): an inline "Been here? Rate it" block under the header, then Yes/Skip questions on the five opinion Characteristics, all into the visitor's one Review; replaces the Rate place modal, fixes silent failures; ~5–7 days, frontend only.
- [What does the "which Place suits you" quiz ask, and how does it pick Places?](issues/04-place-quiz.md): 5 questions on `/quiz` (Neighborhood, what for, where you sit, who with, must-haves) mapped to Amenities; soft scoring with Neighborhood as the only hard filter and Average rating ≥ 4.0; 3 cards with Favorite and one-tap Rating; answers in the URL; ~6–8 days, new backend query.
- [What is a Visit and what does it give the visitor?](issues/05-visits.md): a Visit is any Place with the person's own Review, not a separate mark, so "Been here? Rate it" stays the only button; progress "4 of 41 in Mitte" in the thank-you and on the Neighborhood page (plus "Been here" badges), Guests included via Claim; ~3–4 days, small backend query.
- [Which "best in Neighborhood" lists are worth showing?](issues/06-best-in-neighborhood.md): four fixed Shortlists (Work, Dog friendly, Outdoor seating, Breakfast & brunch) between Top rated and a new "All N Places" list; a Place qualifies by all Amenities of the set plus Average rating ≥ 4.0, top 5, hidden under 3; anchors, no own URLs; cards ask for a one-tap Rating, then the matching Characteristic; ~4–5 days, new backend query.
- [Rank the candidates into the final list](issues/07-rank-candidates.md): build order 1 One-tap contributions (~5–7 d) → 2 Shortlists on the Neighborhood page (~5–6 d) → 3 Visits (~3–4 d) → 4 Photo without Review text (~1.5–2 d, frontend only, split off as its own candidate) → 5 Quiz (~5–7 d, weakest effect on contribution); costs assume everything above is built; ~20–26 days in total. Destination reached; picking is the user's call.

## Not yet specified

- How success is measured for whatever gets built: which GA events, what counts as "working" at this traffic. A required question for the spec of the picked feature; decided for One-tap contributions in [its spec](../one-tap-contributions/spec.md) (database as ground truth, 3× baseline Ratings after eight weeks).

## Out of scope

- Email digests or "new Place near you" notifications: a handful of subscribers at this traffic, and consent/unsubscribe is real work.
- Badges, challenges, leaderboards: look empty without critical mass.
- Standalone SEO work (meta tags, landing pages), including own URLs per Shortlist and Neighborhood pages in the sitemap.
- A general coffee-knowledge quiz: doesn't lead to Places.
- Follow-ups beyond this ranked list, to revisit as separate efforts (ruled in [Rank the candidates into the final list](issues/07-rank-candidates.md)): Quiz share mechanics (OG image, share link) and a saved taste profile; three-valued Characteristics and a "people say" signal on Shortlists; Visits beyond progress counts ("not visited" Filter, "Been there" map layer, "My places" page).
