# 03: Review page: the admin publishes or rejects a Place suggestion

**What to build:** the admin opens the link from the email and lands on `/suggestions/:id/review?token=…` (ADR 0002). Opening it changes nothing. While the suggestion is `pending`, the page shows:
- what was sent and whether a Guest or User sent it;
- other pending suggestions with a similar name;
- a Publish form: name, address, coordinates pasted as "52.51, 13.40", Neighborhood from the twelve, description, Instagram, website, phone and a Google Place ID field typed by hand for now (ticket 05 adds the lookup).

**Publish** creates the Place and the page shows the outcome with a link to it. **Reject** discards the suggestion. A decided suggestion shows only its outcome; a bad link shows "This link is not valid". No photos yet (ticket 04).

**Blocked by:** backend `../coffemap-server/.scratch/place-suggestions/issues/02-publish-and-reject.md` (and its 01).

**Status:** done

- [x] Route `/suggestions/:id/review` reading `token` from the query, `noindex`, usable at phone width
- [x] Coordinates parse from "lat, lng" (spaces optional); unparsable or outside Berlin shows an error
- [x] Publish stays disabled until name, address, valid coordinates and a Neighborhood are set; a duplicate Google Place ID error from the server shows with a link to that Place
- [x] Publish and Reject act only on a button press; afterwards the page shows the outcome (published with a link to the Place, or rejected)
- [x] Decided and invalid-token states render without the form
- [x] Component tests with mocked Apollo cover coordinate parsing, the disabled Publish, the duplicate error, both outcomes and the invalid-token state

## Comments

- 2026-09-27: Implemented on `feat/suggestion-review-page`. Page `src/pages/SuggestionReviewPage` (pages-first: `components/SentSuggestion`, `PublishForm`, `ReviewOutcome`), route `/suggestions/:id/review`, `noindex, nofollow`.
- Codegen ran against the local backend at `main` (`b099254`), rebuilt and restarted on :3000.
- The twelve Neighborhoods and Berlin's bounds are copied into the page's `constants`, matching `../coffemap-server/src/utils/berlinGeography.ts`; the server still validates both, so a drift fails Publish with BAD_USER_INPUT rather than publishing wrong data.
- The duplicate Google Place ID error keeps Publish disabled while the field still holds that ID; the existing Place's id is read as the last 24-hex word of the message (backend 02 Comments).
- Publish and Reject wait for each other, so only one decision is ever on its way. A link without a token or with a bad one shows "This link is not valid"; other load errors get their own message.
- Checked in the browser at 390px against the local backend: the pending test suggestion `6ab8eb9f00eade1d1007d117` renders with the form, and a bad token shows "This link is not valid". Publish and Reject were not pressed there, since the local server talks to the Atlas database; they are covered by the component tests.
- Code review: Spec found no deviations. Standards: applied the form hook (`components/PublishForm/model/usePublishForm.ts`), a `Neighborhood` type, and renames. Left as they are: "review" in names follows the spec's own "review page" wording (the admin reviews a Place suggestion, not a Review), and the place-link `generatePath` and GraphQL error-code reading repeat patterns found in other slices; extracting them to `shared` is past this ticket.
