# 02: Amenity synonyms in `filteredPlaces`

**What to build:** Amenities that Google spells in several ways (Wi-Fi / Free Wi-Fi, Cozy / Cosy, the Dogs allowed variants, Breakfast / Brunch) count as one. Choosing "Dogs allowed" in the map's Filters finds every Place with any spelling of it. The synonym table is one server-side module, reused by Shortlists now and by the Quiz later. Backend only, in `../coffemap-server`. Spec: [Shortlists on the Neighborhood page](../spec.md), Amenity synonym table, Backend: `filteredPlaces`.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] The synonym table is built from the real names: list `availableAdditionalInfoTags` against production (read-only, never write) and group the spellings; the canonical name is the spelling on the most Places; a comment records the date checked
- [x] A name not in the table stands for itself
- [x] `filteredPlaces` expands each requested Amenity to any of its spellings; Amenities stay combined with AND; the response shape doesn't change
- [x] Resolver tests against a throwaway mongod (prior art: the Photo upload test) cover: a synonym spelling matches its canonical name, AND across Amenities, an unknown name matches only itself, hidden Places left out
- [x] Checked in the browser through Chrome DevTools MCP with the local backend: the map's "Dogs allowed" Filter returns more Places than before, including one Google lists under another spelling

**Resolved (2026-09-26):** backend commit `65e1097` in `coffemap-server`. The table (`src/amenities/synonyms.ts`) has 29 groups from the 145 production names. Close but different Amenities stay apart: Good for kids / Family-friendly, Quick bite / Quick visit, Paid Wi-Fi / Wi-Fi. Three ties (Happy hour drinks, Wheelchair accessible restroom, Sports) are resolved in comments. Browser check: the map's "Dogs allowed" Filter returned 187 Places vs 173 before, including Café Komine, listed only under a variant; none dropped.
