# 02: Give the Filters modal's Neighborhood section the same grid

**What to build:** The Neighborhood section of the Filters modal shows "All" plus the thirteen Neighborhoods in the same `NeighborhoodGrid` the nav picker uses, replacing today's centered, wrapping pills and their own scroll box. Behavior stays as today: "All" clears the selection, each Neighborhood toggles, several can be selected, and the selection applies on "Apply Filters". Each cell now tells assistive tech whether it's pressed. See [spec](../spec.md), Implementation Decisions (`NeighborhoodFilter`).

**Blocked by:** 01 (Show the nav's Neighborhoods as a compact grid, expanding inline in the mobile menu) — it creates the `NeighborhoodGrid` entity.

**Status:** resolved

- [x] The section shows a group named "Neighborhood" holding an "All" cell and a cell per Neighborhood, in the shared grid: three columns in the desktop modal, two in the mobile bottom sheet.
- [x] With no selection, "All" is pressed and every Neighborhood is not pressed (`aria-pressed`).
- [x] Tapping two Neighborhoods marks both pressed and "All" not pressed; tapping one again unpresses it; tapping "All" unpresses every Neighborhood and presses "All".
- [x] The section has no scroll box of its own; the modal's scroll is the only one. The old list and pill styles are removed.
- [x] Loading shows "Loading neighborhoods..." and empty or error shows "No neighborhoods available", each as one line in place of the grid.
- [x] `FilterPanel.test.tsx` covers the pressed-state behavior above with a mock returning a few real Neighborhoods; the Features spinner test still passes.
- [x] Checked in the browser at 1440×900 and 390×844: the grid matches the nav picker's cell look.
