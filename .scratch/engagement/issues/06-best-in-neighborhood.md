# Which "best in Neighborhood" lists are worth showing?

Type: grilling
Status: resolved
Blocked by: 02

## Question

Lists like "best Wi-Fi in Neukölln" or "dog friendly in Mitte" on Neighborhood pages. Which criteria (Characteristic, Amenity, Average rating), how a Place qualifies with thin data, whether each list gets its own URL for search, and how a list invites the visitor to mark the Characteristic themselves. Rough cost included.

## Answer

Decided in a grilling session, 2026-09-24. Fact check: `src/pages/NeighborhoodPage/ui/NeighborhoodPage.tsx` queries `filteredPlaces` with `minRating: 4.5` and redirects to `/` after 2 s when empty; the site is an SPA (Helmet, no prerender) and `public/sitemap.xml` lists no Neighborhood pages. The eight Characteristics are in `src/shared/constants/iconCharMap.ts`. New term in `CONTEXT.md`: **Shortlist**.

**Neighborhood page**, top to bottom:
1. Top rated: the current list (Average rating ≥ 4.5), kept for the search-facing title.
2. Four Shortlists, the same on every Neighborhood, in this order: Work (Good for working on laptop + Wi-Fi), Dog friendly, Outdoor seating, Breakfast & brunch. Cozy and Great coffee are left out: ~80% of Places have them, so they tell nothing apart. Kids or Vegan can be added later as a row in the table.
3. "All N Places in Mitte": every visible Place, sorted by Average rating, Places without a Rating last with "No ratings yet — be the first". This fixes "Neighborhood page hides unrated Places" (see [How many steps and where is the friction on the way to a Rating today?](01-current-path-to-a-rating.md)) and makes the Visit progress and "Been here" badges from [What is a Visit and what does it give the visitor?](05-visits.md) cover every Place they count.

**Shortlist rule:** a Place qualifies when it has *all* Amenities of the set (synonyms merged through the server-side answer → Amenities table from [What does the "which Place suits you" quiz ask, and how does it pick Places?](04-place-quiz.md)) and Average rating ≥ 4.0. Sorted by Average rating; top 5 plus "See all N on the map" (the map with matching Filters). Fewer than 3 qualifying Places hides that Shortlist in that Neighborhood, so Spandau, Marzahn-Hellersdorf and Lichtenberg get only the full list. Each Shortlist has an anchor (`/neighborhood/mitte#dog-friendly`), no URL of its own.

**Contribution on cards** (Shortlists and full list): "Been here? Rate it" with the one-tap Rating, then one question on the Characteristic matching the Shortlist, Yes / Skip, into the visitor's one Review: Work → free Wi-Fi, Dog friendly → pet friendly, Outdoor seating → outdoor seating, Breakfast & brunch → yummy eats. The other opinion Characteristics stay on the Place page. A visited Place shows the "Been here" badge.

**Backend:** a new query (e.g. `neighborhoodShortlists(neighborhood)`) returns each Shortlist's top 5 and count, reusing the quiz's synonym table. The full list uses `filteredPlaces` without `minRating`. `filteredPlaces` itself should expand Amenities through the same synonym table so "See all N on the map" shows N, not fewer; this fix is shared with the quiz and is counted in whichever is built first.

**Also:** an unknown Neighborhood slug shows the Not found page instead of the silent redirect to `/`.

**Not in this feature:** own URLs per Shortlist and Neighborhood pages in the sitemap (standalone SEO, out of scope); a "people say" Characteristic signal on Shortlists once counts grow.

**Rough cost:** ~4–5 days. Backend ~1–1.5 (Shortlists query, synonyms in `filteredPlaces`, tests); frontend ~3–3.5 (three sections, Shortlist blocks with anchors and "See all", card with one-tap Rating + Characteristic question, Not found). Built before the quiz, add ~1 day for the synonym table; before one-tap contributions, add ~1 day for the beans component.
