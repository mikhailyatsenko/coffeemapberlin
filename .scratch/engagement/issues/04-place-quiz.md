# What does the "which Place suits you" quiz ask, and how does it pick Places?

Type: grilling
Status: resolved
Blocked by: 02

## Question

5–7 questions about taste, atmosphere and Neighborhood ending in a handful of Places. Which questions, what Place data each answer maps to, how many results, where the quiz lives and is entered from (Place/Neighborhood pages get the traffic), and what the result page offers next (Favorite, Visit, Rating). Rough cost included.

## Answer

Decided in a grilling session, 2026-09-24. Fact check: the backend `filteredPlaces` (`../coffemap-server/src/graphql/resolvers/filteredPlacesResolver/services/filteredPlacesAggregationService.ts`) is a hard `$and` over Amenities with no ranking, and only the single-Place query returns Amenities (`src/shared/query/places/queries.ts`). New term in `CONTEXT.md`: **Quiz**.

**Where:** its own route `/quiz`. Entered from a small card on the Place page (below the "Been here? Rate it" block from one-tap contributions, so it doesn't pull people away before they contribute), from the Neighborhood page (Neighborhood pre-filled), and from the Navbar or main page. Answers live in the query string (`/quiz?n=mitte&for=work&sit=in&with=dog`), so a result is linkable and survives a reload.

**Questions** (each has "Doesn't matter", worth 0 points):
1. Where? Neighborhood: the four big ones, "other" (dropdown), or anywhere.
2. What for? Coffee itself → Great coffee · breakfast/brunch → Breakfast · work → Good for working on laptop + Wi-Fi · hang out → Cozy. **Weight ×2.**
3. Where do you sit? Inside → Dine-in + Cozy · outside → Outdoor seating · takeaway → Takeout.
4. Who with? Alone · friends · kids → Good for kids · dog → Dogs allowed.
5. Must-haves (multi, optional): Vegan options · Wheelchair accessible · Restroom · Quiet. Keep Quiet only if the spec finds it on ≥ ~25% of Places.

Left out on purpose: friendly staff and affordable prices (no Amenity, Characteristics are empty) and brewing-method questions (no data).

**Picking:** soft scoring, not Filters. Neighborhood is the only hard filter. Every matching Amenity adds points and a missing one adds 0, because missing means unknown. Places need Average rating ≥ 4.0; ties go to the higher Average rating. It runs as a new backend query (e.g. `quizMatches`) that returns the top 3, the total count, and the matched Amenities per Place. A server-side table maps each answer to its set of Google Amenity names, merging synonyms (Cozy/Cosy, Dogs allowed variants, Wi-Fi/Free Wi-Fi). That table can be reused by the "best in Neighborhood" lists.

**Result:** 3 cards plus "Show all N on the map" (the map with matching Filters). Each card: the Place, a line "Matches: Outdoor seating · Dogs allowed" (matched Amenities only), Favorite, and "Been here? Rate it" with the one-tap Rating from one-tap contributions (invisible reCAPTCHA and Guest identity per ADR 0001). Fewer than 3 matches in the Neighborhood, or none: show what there is plus "Try anywhere in Berlin", never a silent fill from other Neighborhoods. A visited Place shows "You've been here · 4" instead of "Rate it" (see [What is a Visit and what does it give the visitor?](05-visits.md)).

**Not in this feature:** OG image and share mechanics (still fog on the map), a saved taste profile (still fog), success metrics (map-wide fog).

**Rough cost:** ~6–8 days. Backend ~2 (scoring resolver, synonym table, tests); frontend ~3–4 (`/quiz` route, 5 steps, URL state, result cards, thin/empty states); entry cards on Place, Neighborhood and Navbar ~1. It reuses the beans component from one-tap contributions; if the quiz is built first, add ~1 day.
