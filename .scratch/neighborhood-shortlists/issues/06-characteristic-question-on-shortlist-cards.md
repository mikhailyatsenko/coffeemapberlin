# 06: Characteristic question on Shortlist cards

**What to build:** On a Shortlist card, once the person has a Rating, the card asks one Yes / Skip question about the Characteristic matching the Shortlist: Work → free Wi-Fi, Dog friendly → pet friendly, Outdoor seating → outdoor seating, Breakfast & brunch → yummy eats. Yes marks it in the person's one Review; Skip stores nothing. Top rated and full-list cards ask nothing. Frontend only. Spec: [Shortlists on the Neighborhood page](../spec.md), Frontend: cards, Analytics.

**Blocked by:** 05 (One-tap Rating on every card)

**Status:** resolved

- [x] The card contribution component (`CardContribution` in `features/RateNow`) also takes the person's `ownCharacteristics`; 05 left it out as unused, so add the field to the `FilteredPlaces` and `NeighborhoodShortlists` queries (the server fills it) and pass it from the page
- [x] The card contribution component takes an optional Characteristic to ask; the page passes it from the Shortlist's constant, none for Top rated and full-list cards
- [x] The question reuses the Yes / Skip UI of `CharacteristicQuestions`: no batching, no "More questions?", no "Your marks", no Photo button, no Review text link
- [x] Shown only once a Rating exists and only when the Characteristic isn't in `ownCharacteristics`; Yes is never sent for a marked one
- [x] A confirmed Yes writes the Characteristic into the cached `ownCharacteristics`, so the question leaves every card of that Place; a failed Yes leaves the cache as it was and brings the question back with a message; Skip hides it on that card for the page view
- [x] `characteristic_answered` and `contribution_failed` (`kind: 'characteristic'`) carry `surface: 'neighborhood_card'` and `section`; the Place page block sends `surface: 'place_page'`
- [x] Page tests cover: no question before a Rating, none on Top rated or full-list cards, none when already marked, Yes sends `toggleCharacteristic` and clears every card of the Place, Skip sends nothing, a failed Yes comes back, the events
- [x] Checked in the browser through Chrome DevTools MCP at 375×812: the question's layout on a card, and answering Yes on a Place that appears in two Shortlists

**Resolved (2026-09-26):** frontend only, in the commit that closes this ticket.
- The Yes / Skip row is now its own `components/CharacteristicQuestion` in `RateNow`, used by `CharacteristicQuestions` and by `CardContribution`; question texts for all eight Characteristics live in `QUESTION_TEXT`.
- The card logic is `model/useCardQuestion`. `useToggleCharacteristic` still updates only the Place page's `characteristicCounts`; the card adds the mark to `ownCharacteristics` itself. A Yes on the Place page doesn't reach cached cards; the Neighborhood page refetches (`cache-and-network`) on the next visit.
- After Yes or Skip the question disappears, so focus moves to the card's "change".
- Place page `characteristic_answered` now carries `surface: 'place_page'`.
- On this page no two cards of one Place ask the same Characteristic, so "clears every card" is tested as: the question stays gone after the save settles (it reads the cached `ownCharacteristics`).
- Browser check at 375×812 with `CreateGuestIdentity`, `AddRating` and `ToggleCharacteristic` stubbed in the page (the local server writes to Atlas); reads were real. Five Elephant (Dog friendly, Outdoor seating, Breakfast & brunch): after a Rating each Shortlist card asked its own question, Top rated and full-list cards none; Yes on Dog friendly removed only "Pet friendly?"; a failed Yes on Outdoor seating brought the question back with the message.
