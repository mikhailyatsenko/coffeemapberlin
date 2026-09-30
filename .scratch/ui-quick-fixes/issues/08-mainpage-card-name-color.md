# 08: Drop the decorative accent color from MainPage Place-card names

**What to build:** Place names on MainPage's list cards render in the same neutral text color NeighborhoodPage's cards already use, instead of the brand accent color with no functional meaning.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `PlaceCard`'s name/header no longer renders in the hardcoded accent color; it uses `var(--text-primary)`, matching `NeighborhoodPlaceCard`'s existing treatment.
- [ ] The favorite (heart) icon beside the name is visually unaffected — verified, not just assumed, since it sets its own explicit color independent of the header.
- [ ] No other part of the card (rating, neighborhood pill, address, icons) changes.
- [ ] Confirmed via type-check/lint/build and a visual check (this is a CSS-only change; no new unit test expected per the spec's Testing Decisions).

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §10.
