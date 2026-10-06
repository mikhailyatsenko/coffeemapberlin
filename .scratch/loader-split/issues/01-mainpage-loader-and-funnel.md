# 01: Keep the full-screen Loader for MainPage's first load only, and show Filters' loading on the funnel button

**What to build:** The full-screen `Loader` announces itself to assistive technology as a "Loading" status. On MainPage it shows only while the first Places load and while Filters' results load on arrival (MainPage opening with Filters already set, e.g. from a Shortlist's "See all on the map"). After Apply in the Filters modal, the page is no longer blacked out: the map and the list keep what they showed until the filtered Places arrive, and the funnel button shows a small spinner in place of its count badge meanwhile. See [spec](../spec.md), rows 1–3 of the table, Implementation Decisions (Heavy; MainPage: first load vs. Apply) and Testing Decisions (MainPage).

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] The full-screen `Loader` has `role="status"` and the accessible name "Loading"; its animation is hidden from assistive technology; its look is unchanged.
- [ ] MainPage shows the full-screen `Loader` while the first page of Places loads, and while Filters' results load from the apply that runs on arrival; it never lists the unfiltered Places in between on arrival.
- [ ] After Apply in the Filters modal, MainPage shows no full-screen `Loader`. The arrival/modal distinction lives in MainPage's own logic, not in a new store flag.
- [ ] After Apply, the Places shown before stay on the map and in the list until the filtered Places arrive (no clearing on Apply, as today).
- [ ] `FloatingFilterButton` takes a `loading` prop: while true, a small `Spinner` replaces the count badge, the button has `aria-busy`, its accessible name is "Open filters, loading results", and it stays clickable. When loading ends the badge returns with the new count. The `activeFilterCount` contract is unchanged.
- [ ] `MainPage.test.tsx` gains the cases from the spec's Testing Decisions (first load; arrival with Filters; Apply from the modal shows no full-screen state and a loading funnel, then the count; earlier Places stay until the new ones arrive). Existing cases pass unchanged.
- [ ] The Filters modal's live result count and its Features spinner behave as before; `FilterPanel`'s tests pass.
- [ ] Browser check at 1440×900 and 390×844: first load, arrival from a Shortlist, and Apply from the modal.
- [ ] `npm test`, `npm run lint:ts` and the type check pass.
