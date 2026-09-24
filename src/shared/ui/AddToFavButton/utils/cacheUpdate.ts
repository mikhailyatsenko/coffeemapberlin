/* eslint-disable @typescript-eslint/no-restricted-imports -- shared/ui must not use the Apollo client; this helper is part of AddToFavButton's own data access, and moving it out is a design change. TODO: .scratch/architecture-debt/issues/02-addtofavbutton-data-access.md */
import { client } from 'shared/config/apolloClient';

export const cacheUpdate = (placeId: string) => {
  client.cache.modify({
    id: `PlaceProperties:${placeId}`,
    fields: {
      isFavorite(existing = false) {
        return !existing;
      },
    },
  });
};
