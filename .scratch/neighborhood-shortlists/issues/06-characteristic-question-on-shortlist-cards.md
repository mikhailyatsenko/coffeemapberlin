# 06: Characteristic question on Shortlist cards

**What to build:** On a Shortlist card, once the person has a Rating, the card asks one Yes / Skip question about the Characteristic matching the Shortlist: Work → free Wi-Fi, Dog friendly → pet friendly, Outdoor seating → outdoor seating, Breakfast & brunch → yummy eats. Yes marks it in the person's one Review; Skip stores nothing. Top rated and full-list cards ask nothing. Frontend only. Spec: [Shortlists on the Neighborhood page](../spec.md), Frontend: cards, Analytics.

**Blocked by:** 05 (One-tap Rating on every card)

**Status:** ready-for-agent

- [ ] The card contribution component takes an optional Characteristic to ask; the page passes it from the Shortlist's constant, none for Top rated and full-list cards
- [ ] The question reuses the Yes / Skip UI of `CharacteristicQuestions`: no batching, no "More questions?", no "Your marks", no Photo button, no Review text link
- [ ] Shown only once a Rating exists and only when the Characteristic isn't in `ownCharacteristics`; Yes is never sent for a marked one
- [ ] A confirmed Yes writes the Characteristic into the cached `ownCharacteristics`, so the question leaves every card of that Place; a failed Yes leaves the cache as it was and brings the question back with a message; Skip hides it on that card for the page view
- [ ] `characteristic_answered` and `contribution_failed` (`kind: 'characteristic'`) carry `surface: 'neighborhood_card'` and `section`; the Place page block sends `surface: 'place_page'`
- [ ] Page tests cover: no question before a Rating, none on Top rated or full-list cards, none when already marked, Yes sends `toggleCharacteristic` and clears every card of the Place, Skip sends nothing, a failed Yes comes back, the events
- [ ] Checked in the browser through Chrome DevTools MCP at 375×812: the question's layout on a card, and answering Yes on a Place that appears in two Shortlists
