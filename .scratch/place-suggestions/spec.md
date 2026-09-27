# Spec: Place suggestions

Status: done
Origin: [Anyone can suggest a missing Place; the admin approves in one click](issues/01-place-suggestions.md). Decision record: [ADR 0002: the admin acts through signed links](../../docs/adr/0002-admin-acts-through-signed-links.md); Guests as in [ADR 0001](../../docs/adr/0001-guest-reviews-without-account.md).

## Problem Statement

Places reach the map only when the admin adds them by hand. A visitor who knows a good Place that isn't on the map has no way to say so. At ~30–40 visitors a day every contribution counts, and a missing Place is the most valuable one: it adds a page, not just a Rating.

The admin, for their part, has no admin UI and no admin role. Whatever lands with them has to be quick to check and publish from an email, without adding moderation work beyond that one decision.

## Solution

A short public form at `/suggest`: the Place's name and address are required. What makes it good, its Instagram, up to 10 Place photos and (for Guests) an email to hear back are optional. While the visitor types the name, the form shows up to three existing Places with a similar name ("Is it one of these?") so they don't suggest a Place already on the map. Guests submit without an account, using their Guest identity (ADR 0001), and a daily limit stops floods.

The admin gets an email with a link to a review page for that one Place suggestion. The link is the only authorization (ADR 0002). On the page the admin sees what was sent and completes the Place:

- **Find on Google** looks up to three matching Google Place IDs for free and shows each as a Google Maps link to check; "Use" puts the ID into the form. An ID that already belongs to a Place blocks publishing and links to that Place.
- The admin types coordinates (pasted from Google Maps as "52.51, 13.40"), picks the Neighborhood, and fixes or adds the description, Instagram, website and phone.
- They remove any photo they don't want.
- **Publish** creates the Place with the remaining Place photos, the first becoming its card image. **Reject** discards the suggestion and its photos.

Opening hours, phone, website and business status arrive later from the monthly Google sync, via the Google Place ID. The suggester hears back only when the Place is published, by an email with a link to the new Place asking them to rate it.

## User Stories

1. As a visitor who knows a Place that isn't on the map, I want a form to suggest it, so that others can find it too.
2. As a visitor, I want to give only the name and address, so that suggesting takes under a minute.
3. As a visitor, I want to add what makes the Place good, so that my suggestion carries my reason.
4. As a visitor, I want to add the Place's Instagram, so that the admin can check it quickly.
5. As a visitor who took pictures, I want to add up to 10 photos of the Place, so that its page doesn't start empty.
6. As a visitor, I want the form to tell me which fields are required and why a field is invalid, so that I'm not left guessing.
7. As a visitor typing a name, I want to see existing Places with a similar name, so that I don't suggest one that is already on the map.
8. As a visitor who spots their Place among those shown, I want a link to its page, so that I can go there instead of suggesting it.
9. As a visitor whose Place only looks similar to an existing one, I want to submit anyway, so that a name clash doesn't block me.
10. As a Guest, I want to suggest a Place without an account or a visible captcha, so that there is no barrier.
11. As a Guest, I want to leave my email optionally, so that I hear back when the Place is added.
12. As a Guest, I want to know my email is used only for this, so that I'm comfortable giving it.
13. As a User, I want to be told by email when my Place is added without typing my email, so that the form stays short.
14. As a visitor, I want a clear thank-you after submitting that says what happens next, so that I know it arrived.
15. As a visitor whose photo upload failed, I want to know which photo failed, so that I can try again or leave it out.
16. As a visitor who hit the daily limit, I want a clear message, so that I know to come back later.
17. As a visitor who found nothing in Search, I want a "Suggest it" link right there, so that I can add the Place I was looking for.
18. As a visitor on a Neighborhood page, I want a "Know a Place that's missing?" link under All N Places, so that I can fill a gap I noticed.
19. As any visitor, I want a "Suggest a Place" link in the menu, so that I can find the form without searching first.
20. As the admin, I want an email for each new suggestion with its name, address and a link to review it, so that I notice suggestions without checking anywhere.
21. As the admin, I want the link to open the review page without signing in, so that I can act from my phone in one go.
22. As the admin, I want opening the link to change nothing, so that a mail scanner following it can't publish or reject anything.
23. As the admin, I want to see the name, address, description, Instagram, photos and who suggested it (Guest or User), so that I can judge it.
24. As the admin, I want "Find on Google" to give up to three Google Place IDs as Google Maps links, so that I can check which is the right Place without paying for a lookup.
25. As the admin, I want "Use" next to a candidate to fill in the Google Place ID, so that the monthly sync will fill hours, phone and website.
26. As the admin, I want to be told when a candidate's Google Place ID already belongs to a Place, with a link to it, so that I don't publish a duplicate.
27. As the admin, I want Publish blocked while the form holds a Google Place ID of an existing Place, so that a duplicate can't slip through.
28. As the admin, I want to publish without a Google Place ID when Google finds nothing, so that small Places still get on the map.
29. As the admin, I want to see other pending suggestions with a similar name, so that I can reject the duplicates.
30. As the admin, I want to paste coordinates as Google Maps copies them, so that I don't retype two numbers.
31. As the admin, I want coordinates outside Berlin rejected, so that a swapped latitude and longitude doesn't put a Place in the sea.
32. As the admin, I want to pick the Neighborhood from the twelve, so that it matches the spelling Places use.
33. As the admin, I want to edit the name, address, description and Instagram and add a website and phone, so that the Place goes live correct.
34. As the admin, I want to remove individual photos, so that only good Place photos go live.
35. As the admin, I want the first remaining photo to become the Place's card image, so that its card isn't the default picture.
36. As the admin, I want Publish to create the Place in one press, so that approving costs no more than the review.
37. As the admin, I want Publish to require name, address, coordinates and Neighborhood, so that no Place goes live without a pin and a Neighborhood.
38. As the admin, I want Reject to discard the suggestion and its photos in one press, so that spam costs me one tap.
39. As the admin, I want a second press or a later visit to the link to show the outcome instead of acting again, so that nothing is published twice.
40. As the admin, I want suggestions I never act on to simply wait, so that nothing expires behind my back.
41. As a suggester, I want an email when my Place is published, with a link to it, so that I can see it live and rate it.
42. As a Guest suggester, I want my email deleted once my suggestion is decided, so that it isn't kept longer than needed.
43. As a visitor, I want a newly published Place to appear on the map, in Search and on its Neighborhood page right away, so that the site feels current.
44. As the owner, I want the new Place's hours, phone and website filled by the monthly sync without any extra paid Google call, so that the feature stays inside Google's free tier.
45. As the owner, I want the review page kept out of search engines, so that suggestion links never show up in results.

## Implementation Decisions

**Domain**

- New term **Place photo** (in `CONTEXT.md`): an image of the Place itself, shown at the top of its page, not tied to any Review. These are the files the Place page already lists from the Place's own ImageKit folder. Suggestion photos become Place photos, never Review Photos.
- A Place suggestion has a status: `pending`, `published` or `rejected`. Only `pending` can change, and only to one of the other two. There is no expiry.

**Backend** (in `../coffemap-server`, see its tracker)

- New model **PlaceSuggestion**: name, address, description, Instagram, the suggester (exactly one of `userId` / `guestId`, absent rather than null, as for Reviews), an optional Guest email, status, photo count, the published Place's id, created and decided timestamps.
- `submitPlaceSuggestion(input, guestId?, guestSecret?)`:
  - The actor is resolved the way Reviews resolve theirs (User from the session, else a valid Guest identity, else an error).
  - Validates lengths, sets `pending`, and emails the admin through MailerSend (same sender and admin address as the Inaccuracy report) with name, address, whether a User or Guest suggested it, and the review link. Returns the suggestion id.
  - A User's email is not copied into the suggestion; it is read from the account when the outcome email is sent.
- `uploadPlaceSuggestionPhoto(suggestionId, fileBuffer, guestId?, guestSecret?)`:
  - Only the suggester, only while `pending`, at most 10 photos.
  - Compresses the same way Review Photos are and stores them in a suggestion folder in ImageKit. Counts towards the existing Guest photo limit.
  - The admin email doesn't wait for photos; the review page lists whatever is in the folder when opened.
- **Rate limit**: a new bucket for suggestions, 3 per day per IP, for Users and Guests alike.
- **Review link**:
  - The frontend URL `/suggestions/:id/review?token=…`, where the token is an HMAC-SHA256 of the suggestion id with a new server secret.
  - Every admin operation takes `id` + `token` and rejects a bad token. Tokens don't expire (ADR 0002).
- `placeSuggestionForReview(id, token)` returns the suggestion, its photo paths, its status (and the Place id if published), and other `pending` suggestions with a similar name.
- `findGoogleIdsForSuggestion(id, token)`:
  - Calls Google Text Search (New) with the suggestion's name and address and a field mask of `places.id` only (the unlimited free "IDs Only" SKU).
  - Returns up to 3 IDs, each flagged with the id of an existing Place that already has it.
  - No other Google endpoint is called anywhere in this feature.
- `publishPlaceSuggestion(id, token, input)`:
  - The input carries name, address, coordinates, Neighborhood, description, Instagram, website, phone, Google Place ID and the photo paths to keep.
  - Name, address, coordinates (inside Berlin's bounding box) and one of the twelve Neighborhoods are required.
  - Fails with the existing Place's id if the Google Place ID already belongs to a Place.
  - Creates the Place with empty Amenities and opening hours and status `OPERATIONAL`. Moves the kept photos into the Place's own photo folder and sets the first as the Place's card image (default image if none). Deletes the dropped photos.
  - Marks the suggestion `published`, clears the Place list caches so the Place shows up at once, and emails the suggester (User email from the account, else the Guest email, else nobody) with a link to the Place page asking for a Rating. Then erases the Guest email.
- `rejectPlaceSuggestion(id, token)`: deletes the suggestion's photos, marks it `rejected`, erases the Guest email. No email to the suggester.
- Publish and Reject on a suggestion that isn't `pending` change nothing and return its current outcome.

**Frontend**

- New page `/suggest` (pages-first, everything it needs lives in its own `components/` until a second slice needs it):
  - Fields: name, address, "What makes it good?", Instagram, photos (up to 10, same formats and size limit as Review Photos), and for Guests only, an email field captioned "Only to tell you when it's added".
  - "Is it one of these?" shows up to 3 existing Places whose name matches, using Search's matching, each linking to its Place page. It never blocks submitting.
  - On submit, a Guest without an identity gets one first (`ensureGuestIdentity`, invisible reCAPTCHA, as in one-tap contributions). Then the suggestion is created and the photos are uploaded one by one, each with its own state.
  - The thank-you says: "Thanks! We usually check suggestions within a couple of days." Users also see "We'll email you when it's added"; Guests see it only if they gave an email. A failed photo is named and can be retried from the thank-you.
  - The rate-limit error gets its own message.
- New page `/suggestions/:id/review` (reads `token` from the query), `noindex`:
  - While `pending`, it shows the suggestion, the photos with a remove control each, similar pending suggestions, and the Publish form.
  - "Find on Google" shows candidates as Google Maps links (`google.com/maps/place/?q=place_id:<ID>`), each with "Use", or "Already on the map" plus a link.
  - Coordinates are one text field parsed from "lat, lng".
  - Neighborhood is a select of the twelve.
  - Publish stays disabled while a required field is missing, the coordinates don't parse, or the chosen Google Place ID belongs to a Place.
  - Once decided, the page shows only the outcome (with a link to the Place if published). A bad token shows "This link is not valid".
- Entry points:
  - A "Suggest it" link in `EmptySearchResults`.
  - A "Know a Place that's missing? Suggest it" link under the All N Places list on the Neighborhood page.
  - A "Suggest a Place" item in the Navbar.
- No GA events, no success threshold (the owner's call: not measured).

## Testing Decisions

- A good test drives the feature through its public surface and asserts what a caller or a person sees: stored documents, sent emails, files in the (fake) bucket, rendered text and enabled buttons. It does not reach into helpers or component state.
- **Backend, one seam: the PlaceSuggestion resolvers.** Tests run against a throwaway mongod with a fake ImageKit bucket, a fake MailerSend and a stubbed `fetch` for Google, like `tests/uploadReviewImage.test.ts` and `tests/neighborhoodShortlists.test.ts`. They cover:
  - submit as User and as Guest, an invalid Guest identity, and the daily limit;
  - the admin email carrying a valid review link;
  - photo upload only by the suggester, only while `pending`, at most 10;
  - a bad token rejected by every admin operation;
  - the Google lookup sending the IDs-only field mask and flagging IDs already on a Place;
  - Publish:
    - required fields and the Berlin bounds;
    - blocked on a duplicate Google Place ID;
    - creates the Place, moves the kept photos, deletes the dropped ones and sets the card image;
    - emails the suggester (User, Guest with email, Guest without), then erases the Guest email;
  - Reject deleting photos and erasing the email;
  - repeated Publish or Reject changing nothing.
- **Frontend: component tests with mocked Apollo**, like `SearchPlaces.test.tsx` and `DetailedPlace.test.tsx`:
  - on `/suggest`: required-field validation, the similar-Places hint and its links, the Guest email field shown only to Guests, the thank-you variants, a failed photo, and the rate-limit message;
  - on the review page: candidates with Use / Already on the map, coordinate parsing, Publish disabled until valid, photo removal reaching the Publish input, the decided and invalid-token states.

## Out of Scope

- Measuring success (GA events, baseline, threshold): decided not to measure.
- Any paid Google call: no Place Details, Autocomplete or Place Photos at submit or at publish, and no Google photos on the Place.
- Filling Amenities for new Places. `syncGooglePlaces` refreshes only hours, phone, website and business status, so published Places have no Amenities, which keeps them out of Shortlists and Amenity Filters. Follow-up, separate effort: sync Amenities in `syncGooglePlaces`, under the hard constraint that it must stay inside Google's free monthly quota.
- A reason or an email on rejection.
- Editing or withdrawing a suggestion after submitting it; a "My suggestions" page.
- An admin list of all pending suggestions, admin roles, or an admin area (ADR 0002).
- Handling Inaccuracy reports through signed links (possible later on the same pattern).

## Further Notes

- Google facts (checked against Google's pricing page, September 2026): Text Search "Essentials IDs Only" is free with no cap. Place Details Enterprise and Enterprise + Atmosphere have 1000 free requests a month each, and `syncGooglePlaces` already uses ~446 Enterprise requests a month. A Google Maps share link carries no Place ID, hence the name + address lookup.
- A Place published without a Google Place ID never gets hours, phone or website unless the admin later adds its ID in the database.
- The admin can open the review link on a phone. Keep the page usable at phone width.
- New server env var: the HMAC secret for review links. The admin email address is the existing one used by the contact form.
