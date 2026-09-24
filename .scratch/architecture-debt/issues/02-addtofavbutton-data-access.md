# 02: AddToFavButton does its own data access

Status: needs-triage

- **Rule:** `@typescript-eslint/no-restricted-imports` (rule (f): `shared/ui`, `entities/*/ui` and `entities/*/components` get data only through props).
- **Files:**
  - `src/shared/ui/AddToFavButton/ui/AddToFavButton.tsx` imports `useToggleFavoriteMutation` from `shared/generated/graphql`, `GET_FAVORITE_PLACES` from `shared/query/places/queries`, and the `auth`, `guestFavorites`, `modal` and `places` stores.
  - `src/shared/ui/AddToFavButton/utils/cacheUpdate.ts` imports `client` from `shared/config/apolloClient`.
  - `cacheUpdate` is not imported anywhere today, so the redesign can simply delete it.
  - Both files carry a file-level disable of the rule that links this note.
- **Why it wasn't fixed in place:** the fix is a design change, not a local edit. The button owns the whole "toggle favorite" use case: the mutation and its cache update, the guest-favorites fallback for signed-out users, the guest info modal, the places store and analytics. Making it presentational means deciding where that use case lives (for example a `features/ToggleFavorite` slice that wraps a props-only button) and rewiring every place that renders the button: `features/PlaceCard`, `features/AuthIndicator` (FavoritesModal), `widgets/DetailedPlace`, and the entities `TooltipCardOnMap` and `NeighborhoodPlaceCard`. An entity cannot import a feature, so those two need the button passed in from above (a slot or render prop). That is beyond a boy-scout fix.
- **Found by:** `.scratch/fsd-rules/issues/09-no-data-in-presentational-layers.md`.
