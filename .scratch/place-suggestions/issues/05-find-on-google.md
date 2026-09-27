# 05: "Find on Google" on the review page

**What to build:** on the review page, "Find on Google" looks up to three Google Place IDs for the suggestion, for free. Each candidate shows as a Google Maps link (`google.com/maps/place/?q=place_id:<ID>`) so the admin can check it's the right Place, with "Use" to put the ID into the Publish form. A candidate already on the map shows "Already on the map" with a link to that Place instead of "Use". No candidates shows "Google found nothing, you can publish without it". The monthly Google sync later fills hours, phone and website from the ID.

**Blocked by:** 03, backend `../coffemap-server/.scratch/place-suggestions/issues/04-find-google-ids.md`.

**Status:** done

- [x] The button calls `findGoogleIdsForSuggestion`; loading, empty and error states shown
- [x] Each candidate is a Google Maps link opening in a new tab, with "Use" or "Already on the map" + link to the Place
- [x] "Use" fills the Google Place ID field; Publish stays disabled while the field holds an ID that belongs to a Place
- [x] Component tests cover candidates with both flags, "Use" filling the field, the disabled Publish and the empty state

## Comments

- 2026-09-27: Implemented on `feat/suggestion-review-page`, on top of ticket 03. Codegen ran against the local backend at `coffemap-server` `main` (`4999aeb`), rebuilt and restarted on :3000; the generated file also picks up the already-merged photo schema.
- `api/useGoogleIdLookup.ts` runs the lazy `findGoogleIdsForSuggestion` query on a press (`network-only`, so each press asks Google again). While a lookup runs, or after it fails, there are no candidates, so an earlier answer can't keep blocking Publish. Every lookup error shows the same "We couldn't ask Google" message: the token was already checked when the page loaded, so in practice only `GOOGLE_LOOKUP_FAILED` or a network error gets here.
- `components/FindOnGoogle` sits under the Google Place ID field inside `PublishForm`. "Use" sets the field through the form.
- Publish is blocked when the field holds an ID that belongs to a Place. `usePublishForm` returns `googleIdOwner` from two sources: the server's duplicate error or a candidate with `existingPlaceId`. One alert with "Open that Place" covers both. Changed from ticket 03: the duplicate alert now shows only while the field holds that ID, not until the next Publish. An ID typed by hand that the last lookup didn't return is still caught only by the server on Publish.
- `lib/links.ts`: `placePath` (also used by `ReviewOutcome` now) and `googleMapsUrl`. Other slices repeat the same `generatePath`; see `.scratch/architecture-debt/issues/07-duplicated-place-path.md`.
- Checked in the browser at 390px against the local backend with the pending test suggestion `6ab8eb9f00eade1d1007d117`. The real lookup returned no candidates for "Teststraße 1" and showed "Google found nothing, you can publish without it". Candidate rendering, "Use", the blocked Publish and the error state are covered by the component tests.
- Code review. Spec: no gaps. Standards: moved the hook from `model/` to `api/`, dropped stale candidates on refetch or failure (with a test), un-exported `GoogleIdOwner`, renamed a clashing test type, filed debt note 07. Left as they are: `GoogleIdLookup` as three fields rather than a status union, and `PublishForm` taking the whole lookup object rather than a slot. Both are small and readable at this size.
