import { type NeighborhoodPlace } from '../types';

const isRated = (place: NeighborhoodPlace) => Number(place.properties.ratingCount > 0);

/** Best Average rating first, then more Ratings, then by name; Places without a Rating last. */
export const sortPlaces = (places: readonly NeighborhoodPlace[]) =>
  [...places].sort(
    (a, b) =>
      isRated(b) - isRated(a) ||
      (b.properties.averageRating ?? 0) - (a.properties.averageRating ?? 0) ||
      b.properties.ratingCount - a.properties.ratingCount ||
      a.properties.name.localeCompare(b.properties.name),
  );
