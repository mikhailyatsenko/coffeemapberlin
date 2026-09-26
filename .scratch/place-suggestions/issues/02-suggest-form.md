# 02: Suggest a Place form and its entry points

**What to build:** a visitor opens `/suggest` from an empty Search, a Neighborhood page or the Navbar and suggests a missing Place with name and address, optionally what makes it good and its Instagram. Guests may also leave an email. While they type the name, up to three existing Places with a similar name show as links ("Is it one of these?") without blocking the submit. A Guest submits without an account: the first submit gets a Guest identity through the invisible reCAPTCHA (ADR 0001). After submitting they see the thank-you from [the spec](../spec.md); the daily limit gets its own message. No photos yet (ticket 04).

**Blocked by:** backend `../coffemap-server/.scratch/place-suggestions/issues/01-submit-and-review-link.md` (run codegen against its schema).

**Status:** ready-for-agent

- [ ] `/suggest` route with the page built pages-first; name and address required, lengths as in the spec, errors shown per field
- [ ] "Is it one of these?" uses Search's name matching, shows at most 3 Places linking to their pages, never blocks submit
- [ ] The Guest email field ("Only to tell you when it's added") shows only to Guests
- [ ] Submit sends `submitPlaceSuggestion` with Guest credentials when there is no User, creating the Guest identity first if needed
- [ ] The thank-you says "We usually check suggestions within a couple of days"; it adds "We'll email you when it's added" for Users and for Guests who gave an email
- [ ] `RATE_LIMITED` shows its own message; other errors a generic one, and the form keeps its values
- [ ] Entry points: "Suggest it" in the empty Search result, "Know a Place that's missing? Suggest it" under All N Places on the Neighborhood page, "Suggest a Place" in the Navbar
- [ ] Component tests with mocked Apollo (prior art `SearchPlaces.test.tsx`) cover validation, the hint and its links, the Guest-only email, thank-you variants and the limit message
