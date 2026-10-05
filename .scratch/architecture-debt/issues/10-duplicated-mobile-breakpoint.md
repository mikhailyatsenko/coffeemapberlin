# 10: The 900px mobile breakpoint is hardcoded in many slices

Status: needs-triage

**Rule:** Duplicated Code / Shotgun Surgery (smell baseline in the code-review skill); `shared/` holds app-wide constants and styles (`docs/agents/architecture.md`, FSD).

**Where:** `useWidth() <= 900` in JS and `@media (max-width: 900px)` / `(min-width: 901px)` in SCSS across 18 files under `src/`, e.g. `widgets/Navbar`, `features/NeighborhoodDropdown` (`hooks/useNeighborhoodPanel.ts`, its SCSS), `entities/NeighborhoodGrid` (desktop-only cell hover), `features/FilterPanel`. Found in review of neighborhood-picker ticket 01.

**Why past the blast radius:** one shared breakpoint (an SCSS mixin/variable in `shared/styles` plus a JS constant or `useIsMobile` hook in `shared/`) means edits across layers and slices that ticket 01 doesn't touch.
