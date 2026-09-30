Type: grilling
Status: resolved
Blocked by: 01

## Question

How dated does the visual identity actually feel, and what's worth polishing within the current design system (`shared/ui`)? Cover: the mixed typography (script/serif logo and tagline against a plain sans body), the color palette's use (orange accent, coffee-bean rating icon), and card design consistency between the Places list, Place page, and Neighborhood page. Use the reference patterns from [modern-reference-research](01-modern-reference-research.md) to ground the call instead of unaided taste, and flag explicitly if a finding points at the tokens themselves rather than their use.

## Answer

Walked the live site (desktop 1440×900 and mobile 390×844, https://3welle.com) and read `src/shared/styles/theme.css` / `src/index.scss` before deciding.

**Key fact that reframed the question**: the ticket's premise ("script/serif logo and tagline against a plain sans body") was wrong. The whole site — logo, tagline, body, headings — uses one typeface, `Roboto Slab` (a slab serif), applied via a universal `*` selector at weight 200. The tagline "Good coffee map" only *looks* script-like because it's italic + very thin, not a different font. So typography is already structurally aligned with reference ticket 01's takeaway #1 (one family, hierarchy from weight/size) — the real gap is that there's no weight hierarchy at all: body and h1–h4 are all pinned to weight 200, while individual components (`ReviewCard`, `FormField`, `Logo`) each pick their own ad hoc override (bold, 700, 500, 100) with no shared scale.

Decisions:

1. **Typeface and accent-color hue are not the problem — kept as tokens, not reopened.** Neither reads as dated on the live site; both are legitimate, on-brand choices (a slab serif and a warm orange-red suit a craft-coffee brand, unlike the neutral sans-serif agregator sites in ticket 01). Confirmed with the user before closing this off — explicitly not filing a token-change ticket.
2. **Add a real weight hierarchy**: headings move off the flat weight-200 default (e.g. 500) to read as headings; small/meta text in cards moves from 200 to a normal ~400, since 200 renders too thin/low-contrast at small sizes. Applies wherever `index.scss`'s current `h1–h4`/body defaults are used, and existing ad hoc per-component weight overrides get reconciled into this same scale as they're touched.
3. **Drop `--accent-primary` from Place names in MainPage list cards** (currently colored with no semantic meaning — flagged in ticket 01 as the anti-pattern versus reference sites, which reserve accent color for CTAs/active state only). Bring MainPage names to the neutral/near-black treatment NeighborhoodPage cards already use.
4. **Converge Place-card design toward the NeighborhoodPage pattern**: numeric average rating + review count shown alongside the coffee-bean icons, rather than MainPage's current bare row of 5 beans always shown as filled (misleadingly implies every place is rated 5/5 — same baseline problem ticket 01 flagged). Roll the bean-icon-plus-number-plus-count pattern out to MainPage cards. PlacePage keeps its own hero layout (a single-item page, not a list card) but its rating block already matches this pattern (number + beans + count), so no change needed there.
5. Confirmed via `BadgePill`/`theme.css`: the Neighborhood pill's green is an existing semantic token (`--badge-green`), used identically everywhere it appears — no inconsistency, no change needed.
6. Checked `CONTEXT.md`: no new domain vocabulary surfaced by this ticket; no glossary changes.
