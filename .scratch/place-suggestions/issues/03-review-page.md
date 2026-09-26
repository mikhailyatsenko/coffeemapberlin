# 03: Review page: the admin publishes or rejects a Place suggestion

**What to build:** the admin opens the link from the email and lands on `/suggestions/:id/review?token=…` (ADR 0002). Opening it changes nothing. While the suggestion is `pending`, the page shows:
- what was sent and whether a Guest or User sent it;
- other pending suggestions with a similar name;
- a Publish form: name, address, coordinates pasted as "52.51, 13.40", Neighborhood from the twelve, description, Instagram, website, phone and a Google Place ID field typed by hand for now (ticket 05 adds the lookup).

**Publish** creates the Place and the page shows the outcome with a link to it. **Reject** discards the suggestion. A decided suggestion shows only its outcome; a bad link shows "This link is not valid". No photos yet (ticket 04).

**Blocked by:** backend `../coffemap-server/.scratch/place-suggestions/issues/02-publish-and-reject.md` (and its 01).

**Status:** ready-for-agent

- [ ] Route `/suggestions/:id/review` reading `token` from the query, `noindex`, usable at phone width
- [ ] Coordinates parse from "lat, lng" (spaces optional); unparsable or outside Berlin shows an error
- [ ] Publish stays disabled until name, address, valid coordinates and a Neighborhood are set; a duplicate Google Place ID error from the server shows with a link to that Place
- [ ] Publish and Reject act only on a button press; afterwards the page shows the outcome (published with a link to the Place, or rejected)
- [ ] Decided and invalid-token states render without the form
- [ ] Component tests with mocked Apollo cover coordinate parsing, the disabled Publish, the duplicate error, both outcomes and the invalid-token state
