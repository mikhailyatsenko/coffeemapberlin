Type: grilling
Status: resolved

## Question

How does the site handle loading states (map/list fetch, images) and empty/zero-result states (no Places match the Filters, a Neighborhood with nothing "best" for a Shortlist, etc.), and how's the microcopy's tone and clarity across the core pages? Decide what's worth fixing versus what's already fine.

## Answer

Tested live on https://3welle.com (desktop 1440×900): forced a zero-result Filters state, visited a minimal-data Neighborhood page (Dahlwitz-Hoppegarten, one Place), and read the relevant component code (`shared/ui/Loader`, `ImgWithLoader`, `EmptyFilterResults`, `NeighborhoodPage/components/AllPlaces`, `FilterPanel`).

**Key fact**: `shared/ui/Loader` is a single full-screen blocking overlay (fixed, dimmed background, themed coffee-pour animation) reused identically — 15 call sites — for both heavy initial page loads and light actions (Filter re-apply, Contact/Auth form submit, avatar upload). Per-image loading (`ImgWithLoader`) is already a properly scoped inline spinner, no issue there.

Decisions:

1. **Loader overlay**: split into two treatments — keep the full-screen blocker for heavy initial page loads (MainPage/NeighborhoodPage first fetch), replace it with an inline/button-level spinner for light actions (Filter re-apply, form submits, avatar upload).
2. **`EmptyFilterResults` bugs**: fix both — swap the 🔍 emoji for the site's existing SVG icon system, and fix the "Reset Filters" button's text color from `--text-primary` (near-black, a copy-paste inconsistency and real contrast issue) to `--text-inverse` (white), matching every other primary CTA on `--accent-primary`.
3. **Pluralization bug** ("All 1 Places in Dahlwitz-Hoppegarten"): fix site-wide wherever a Place count is rendered, not just the one confirmed spot in `NeighborhoodPage/components/AllPlaces/ui/AllPlaces.tsx`.
4. **`FilterPanel`'s bare "Loading features..." text**: style it with the existing `Spinner` component for consistency with the rest of the site's loading states.
5. **NeighborhoodPage's content-hiding for empty Top-rated/Shortlist sections**: confirmed as the right call — omitting the section entirely (rather than showing it with a "nothing here" message) is less clutter and doesn't suggest something is broken with the Neighborhood. No change.
6. Checked `CONTEXT.md`'s "Shortlist" glossary entry against this ticket's findings: unrelated to loading/empty-state UI, no glossary change.
