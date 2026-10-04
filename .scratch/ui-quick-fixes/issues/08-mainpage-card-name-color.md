# 08: Drop the decorative accent color from MainPage Place-card names

**What to build:** Place names on MainPage's list cards render in the same neutral text color NeighborhoodPage's cards already use, instead of the brand accent color with no functional meaning.

**Blocked by:** None (can start immediately)

**Status:** resolved

- [x] `PlaceCard`'s name/header no longer renders in the hardcoded accent color; it uses `var(--text-primary)`, matching `NeighborhoodPlaceCard`'s existing treatment.
- [x] The favorite (heart) icon beside the name is visually unaffected — verified, not just assumed, since it sets its own explicit color independent of the header.
- [x] No other part of the card (rating, neighborhood pill, address, icons) changes.
- [x] Confirmed via type-check/lint/build and a visual check (this is a CSS-only change; no new unit test expected per the spec's Testing Decisions).

Source: [Ten quick UI fixes spec](../spec.md), Implementation Decisions §10.

**Notes:** Checked on the live card markup by applying the new rule: the name went from `rgb(255, 75, 52)` to `rgb(48, 48, 48)` (`--text-primary`), the heart stayed `rgb(120, 120, 120)` with its SVG background. The spec says `NeighborhoodPlaceCard` already uses `var(--text-primary)`; it actually hardcodes `#111111` on `.title`. Not changed here, as that card is outside this ticket.
