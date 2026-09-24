# 04: Characteristic questions in the block

**What to build:** Yes / Skip questions in the block from [the spec](../spec.md), shown only once the person has a Rating. The pool is the five opinion Characteristics in this fixed order: delicious filter coffee, pleasant atmosphere, yummy eats, friendly staff, affordable prices. Characteristics already marked are left out. Free Wi-Fi, outdoor seating and pet friendly are never asked here. Up to three questions show at once. When the visible ones are answered and more remain, "More questions?" shows the next batch. "Yes" marks the Characteristic in the person's one Review through the existing optimistic toggle, and is sent only for an unmarked Characteristic. "Skip" sends nothing and is remembered only for the current page view. A failed "Yes" brings the question back with the reCAPTCHA or network message.

**Blocked by:** 03 (Inline "Been here? Rate it" block).

**Status:** ready-for-agent

- [ ] No questions before a Rating; up to three after; "More questions?" reveals the rest
- [ ] Free Wi-Fi, outdoor seating and pet friendly are never asked; already marked Characteristics are not asked
- [ ] Yes sends `toggleCharacteristic` and the question leaves; Skip sends nothing and the question leaves for this page view
- [ ] A failed Yes returns the question with the message and fires `contribution_failed` with `kind: characteristic`
- [ ] `characteristic_answered` fires with `characteristic` and `answer: yes | skip` (Yes on server confirmation, Skip on tap)
- [ ] Yes / Skip are real buttons, reachable by Tab and usable with Enter / Space
- [ ] The Place's Characteristic counts update after a Yes
