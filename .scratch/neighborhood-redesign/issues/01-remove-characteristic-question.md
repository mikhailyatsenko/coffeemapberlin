# 01: Remove the Characteristic question from Neighborhood cards

**What to build:** After rating a Place on a Shortlist card, a person is no longer asked "Free Wi-Fi? Yes / Skip" (or the other Shortlists' questions). The card shows only "Been here? Rate it" and then "Your rating: N · change". Frontend only; prefactor for the redesign. Spec: [Neighborhood page redesign](../spec.md), "Removing the Characteristic question".

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `CardContribution` drops the `question` prop and its question logic and UI; anything in `RateNow` used only by the card question goes, while what the Place page uses stays
- [ ] The page's Shortlist display constants drop the `question` field
- [ ] `characteristic_answered` is no longer sent from Neighborhood cards; the Place page's questions and events are unchanged
- [ ] The page test's question cases are replaced by one: after a Rating on a Shortlist card no Characteristic question appears
- [ ] `RateBlock.test.tsx`, `OneTapRating.test.tsx` and the Place page's question tests stay green
