Type: prototype
Status: resolved

## Question

Is the current mobile layout — a horizontal strip of Place cards overlaid on the bottom of the full-screen map — the right interaction pattern, or would something else (a collapsible bottom sheet, a map/list toggle, etc.) feel more modern and convenient? Build a rough, concrete prototype of the strongest alternative(s) to react to, rather than deciding from description alone. Note: the mobile swipe-hint for the current card strip was already solved in `.scratch/places-list-swipe-hint/` and is live — don't re-litigate that specific fix, only the broader pattern it sits inside.

## Answer

Built a live, throwaway prototype on the real `MainPage` route (`?variant=A/B/C`, dev-only, real data and components) with two alternatives to react to alongside the current pattern as baseline:

- **B — TheFork-style**: list-primary vertical scroll, a collapsed non-interactive map preview strip with a "View on map" pill that expands the real map full-screen.
- **C — bottom sheet**: the map stays full-screen and interactive at all times (preserving this product's map-first identity, unlike TheFork's list-first search), and the card strip becomes a 3-state sheet — peek / half / full — via a drag handle.

**Decision: Variant C (bottom sheet) wins.** The user reacted live to both running in the browser and picked C as worth taking forward, with the caveat that it needs detail polish before implementation — real drag physics (the prototype only cycles states on tap, no drag gesture), exact snap heights, handle affordance styling, and how favoriting/search/filters interact with a partially-expanded sheet weren't decided here and are left for whoever implements it.

Prototype code (all three variants + the switcher) captured on the throwaway branch `prototype/mobile-map-list-variants` (commit `94e68c9`), not folded into main — this ticket is a decision, not an implementation. Getting the prototype running with real data also required starting the sibling backend (`../coffemap-server`) locally against its existing MongoDB Atlas cluster; no backend code was changed.
