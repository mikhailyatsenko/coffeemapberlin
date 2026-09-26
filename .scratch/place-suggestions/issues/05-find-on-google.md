# 05: "Find on Google" on the review page

**What to build:** on the review page, "Find on Google" looks up to three Google Place IDs for the suggestion, for free. Each candidate shows as a Google Maps link (`google.com/maps/place/?q=place_id:<ID>`) so the admin can check it's the right Place, with "Use" to put the ID into the Publish form. A candidate already on the map shows "Already on the map" with a link to that Place instead of "Use". No candidates shows "Google found nothing, you can publish without it". The monthly Google sync later fills hours, phone and website from the ID.

**Blocked by:** 03, backend `../coffemap-server/.scratch/place-suggestions/issues/04-find-google-ids.md`.

**Status:** ready-for-agent

- [ ] The button calls `findGoogleIdsForSuggestion`; loading, empty and error states shown
- [ ] Each candidate is a Google Maps link opening in a new tab, with "Use" or "Already on the map" + link to the Place
- [ ] "Use" fills the Google Place ID field; Publish stays disabled while the field holds an ID that belongs to a Place
- [ ] Component tests cover candidates with both flags, "Use" filling the field, the disabled Publish and the empty state
