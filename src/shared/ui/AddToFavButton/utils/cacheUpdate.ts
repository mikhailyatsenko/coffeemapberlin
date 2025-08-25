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
