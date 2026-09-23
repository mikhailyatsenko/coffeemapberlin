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

## Not yet specified

- How success is measured for whatever gets built: which GA events, what counts as "working" at this traffic.
- Share mechanics for the quiz result (OG image, share link shape), if the quiz makes the list.
- Whether the quiz result should later feed a saved taste profile that personalises the map.

## Out of scope

- Email digests or "new Place near you" notifications: a handful of subscribers at this traffic, and consent/unsubscribe is real work.
- Badges, challenges, leaderboards: look empty without critical mass.
- Standalone SEO work (meta tags, landing pages).
- A general coffee-knowledge quiz: doesn't lead to Places.
