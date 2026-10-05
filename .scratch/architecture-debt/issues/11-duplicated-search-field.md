# 11: The search field's markup and styles are copied between SearchPlaces and the Filters' Features search

Status: needs-triage

**Rule:** Duplicated Code (smell baseline in the code-review skill); `shared/ui/` holds design-system primitives (`docs/agents/architecture.md`, FSD).

**Where:** `features/FilterPanel/components/TagsFilter/ui/TagsFilter.module.scss` (`.searchField`, `.searchIcon`, `.searchInput`, `.clearButton`) and the search-icon and clear-icon SVGs in `TagsFilter.tsx` repeat `features/SearchPlaces/ui/SearchPlaces.module.scss` (`.field`, `.searchIcon`, `.input`, `.clearButton`) and `SearchPlaces.tsx`. Copied on purpose in filters-modal ticket 01, whose spec asks the Features search to match Search's field.

**Why past the blast radius:** one shared `SearchField` primitive in `shared/ui` means a new public component and changing `SearchPlaces`, another slice that ticket doesn't touch.
