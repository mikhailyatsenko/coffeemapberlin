# 01: `trackEvent` in shared/lib

**What to build:** a single way to send GA events: `trackEvent(name, params)` in `shared/lib`. It calls `gtag` in production and does nothing elsewhere. The two existing direct `window.gtag` calls (`rate_place_click` in RateNow, `add_to_favorites_click` in AddToFavButton) move onto it. Visitors see no change. Every later ticket sends its events through this seam, and tests mock it instead of the global. Prefactor for [One-tap contributions](../spec.md).

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] `trackEvent` sends the event with its params through `gtag` in production and sends nothing outside production (unit test)
- [x] `rate_place_click` and `add_to_favorites_click` go through `trackEvent`; no direct `window.gtag` call remains in `src`
- [x] Both events still fire with the same names and params as before
