import { useMemo } from 'react';
import { filterPlacesByName } from 'features/SearchPlaces';
import { usePlaceNamesQuery } from 'shared/generated/graphql';
import { MAX_SIMILAR_PLACES, MIN_NAME_LENGTH } from '../constants';

/** Existing Places whose name matches `name` the way Search matches it. */
export const useSimilarPlaces = (name: string) => {
  const { data } = usePlaceNamesQuery();

  return useMemo(() => {
    const places = data?.places.places ?? [];
    if (name.trim().length < MIN_NAME_LENGTH) return [];
    return filterPlacesByName(places, name).slice(0, MAX_SIMILAR_PLACES);
  }, [data, name]);
};
