# 13: The prefers-reduced-motion check is written twice

Status: needs-triage

- **Rule:** `docs/agents/architecture.md`, review baseline: Duplicated Code (a judgement call). App-wide helpers belong in `shared/lib/`.
- **Files:** `src/pages/NeighborhoodPage/components/SectionSwitcher/lib/scrollBehavior.ts` and `src/widgets/PlacesList/components/VirtualizedList/ui/VirtualizedList.tsx` (line 79) both read `window.matchMedia?.('(prefers-reduced-motion: reduce)').matches`.
- **Why it wasn't fixed in place:** a shared helper means moving code into `shared/lib/` and editing `widgets/PlacesList`, a slice that ticket 07 of `.scratch/neighborhood-redesign/` (section switcher) doesn't touch.
