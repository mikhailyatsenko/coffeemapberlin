# What one-tap contributions should the Place page offer?

Type: grilling
Status: resolved
Blocked by: 01

## Question

Which quick inputs (e.g. "Free Wi-Fi here? Yes / No", a one-tap Rating) go on the Place page, where, and for whom? Does a one-tap answer create or update the visitor's Review (a Review can be Characteristics only), and how does that square with the Guest identity and reCAPTCHA flow in ADR 0001? Rough cost included.

## Answer

Decided in a grilling session, 2026-09-24. Fact check: `../coffemap-server/src/models/Interaction.ts` keeps Rating, Review text, Characteristics and Favorite in one document per person and Place; each Characteristic is a boolean defaulting to `false`, so only "yes" can be stored. `addRating` and `toggleCharacteristic` already exist.

**What:** an inline block on the Place page, right under the header and Average rating (on mobile, above the Sidebar).

1. "Been here? Rate it" with 5 beans; a tap saves the Rating at once. This doubles as the "has visited" filter, so visitors from search who haven't been there are not asked opinions.
2. Only once a Rating exists: up to 3 questions at a time, "Yes / Skip", then "More questions?". Asked about the five opinion Characteristics only: delicious filter coffee, pleasant atmosphere, friendly staff, affordable prices, yummy eats. Wi-Fi, outdoor seating and pet friendly are left out because Amenities already cover them as fact. Friendly staff and affordable prices have no Amenity counterpart at all.
3. After an answer: "Thanks!" and "Your rating: 4 · change". Already-answered questions are not asked again. When the questions run out: a link that scrolls to the Review text form ("add a few words or a photo"). No "Create account" modal after a one-tap answer; it stays only after Review text.

**Data:** every answer creates or updates the visitor's one Review for the Place (a Review can be Characteristics only). "Skip" stores nothing; "No" is not a stored value. No model change, no new domain term, ADR 0001 unchanged: the first tap runs the invisible reCAPTCHA and mints the Guest identity.

**Failures and accessibility:** answers show optimistically; on failure (e.g. reCAPTCHA blocked by an ad blocker) they roll back with a readable message, which fixes today's silent failure. Beans become real buttons: keyboard reachable, visible selection on touch.

**Removed:** the "Rate place" modal. The "Rate place" button and the dead "Be first to write one" link now scroll to the block.

**Not in this feature:**
- Photo without Review text: not one tap (pick + upload) and costlier; a separate candidate for the ranking.
- Confirming Amenities ("Google says Wi-Fi, right?"): Amenities are fact, so a "no" is an Inaccuracy report, not a Review.
- Three-valued Characteristics (yes/no/unknown): possible later decision; needs a model change and changes what the counts mean.
- Neighborhood page: no Place context to ask "been here?"; hidden unrated Places belong to "Which 'best in Neighborhood' lists are worth showing?".

**Rough cost:** ~5–7 days, frontend only: inline block replacing the `RateNow` modal, question queue, optimistic/rollback/thank-you states, accessible beans, rewiring two links.
