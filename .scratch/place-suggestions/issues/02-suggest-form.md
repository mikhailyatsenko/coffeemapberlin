# 02: Suggest a Place form and its entry points

**What to build:** a visitor opens `/suggest` from an empty Search, a Neighborhood page or the Navbar and suggests a missing Place with name and address, optionally what makes it good and its Instagram. Guests may also leave an email. While they type the name, up to three existing Places with a similar name show as links ("Is it one of these?") without blocking the submit. A Guest submits without an account: the first submit gets a Guest identity through the invisible reCAPTCHA (ADR 0001). After submitting they see the thank-you from [the spec](../spec.md); the daily limit gets its own message. No photos yet (ticket 04).

**Blocked by:** backend `../coffemap-server/.scratch/place-suggestions/issues/01-submit-and-review-link.md` (run codegen against its schema).

**Status:** done

- [x] `/suggest` route with the page built pages-first; name and address required, lengths as in the spec, errors shown per field
- [x] "Is it one of these?" uses Search's name matching, shows at most 3 Places linking to their pages, never blocks submit
- [x] The Guest email field ("Only to tell you when it's added") shows only to Guests
- [x] Submit sends `submitPlaceSuggestion` with Guest credentials when there is no User, creating the Guest identity first if needed
- [x] The thank-you says "We usually check suggestions within a couple of days"; it adds "We'll email you when it's added" for Users and for Guests who gave an email
- [x] `RATE_LIMITED` shows its own message; other errors a generic one, and the form keeps its values
- [x] Entry points: "Suggest it" in the empty Search result, "Know a Place that's missing? Suggest it" under All N Places on the Neighborhood page, "Suggest a Place" in the Navbar
- [x] Component tests with mocked Apollo (prior art `SearchPlaces.test.tsx`) cover validation, the hint and its links, the Guest-only email, thank-you variants and the limit message

## Comments

- 2026-09-27: Implemented on `feat/suggest-place-form`. Page `src/pages/SuggestPlacePage` (pages-first: `components/SuggestPlaceForm`, `SimilarPlaces`, `SuggestionThanks`), route `/suggest`.
- Codegen ran against the local backend at `main` (`fc23883`), rebuilt and restarted on :3000.
- The hint reads names through a new slim `PlaceNames` query (every Place's id and name, cached by Apollo), because the places store is empty when `/suggest` is opened directly. It uses `filterPlacesByName` from Search, now generic over anything with `properties.name`. It shows from 2 typed characters on, since a single letter matches most of the map.
- Submit is disabled while the session check runs, so a signed-in User is never sent as a Guest and never sees the Guest email field.
- Errors: `RATE_LIMITED` gets its own message and a blocked reCAPTCHA keeps the existing reCAPTCHA message; everything else gets "We couldn't send your suggestion. Please try again." The form keeps its values.
- Checked end to end against the local backend as a fresh Guest: reCAPTCHA → `createGuestIdentity` → `submitPlaceSuggestion` with the Guest credentials, blank optional fields left out, the thank-you shown; the backend logged no mail failure (test suggestion `6ab8eb9f00eade1d1007d117`, to be rejected). The hint was checked against real data, at phone width too.
- Debt: `.scratch/architecture-debt/issues/06-filterplacesbyname-in-feature-lib.md` (Search's matching exported from a feature `lib`, now with two consumers).
