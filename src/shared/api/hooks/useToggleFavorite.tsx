import { type ApolloCache, useMutation } from '@apollo/client';
import { useState } from 'react';
import { useAuth } from 'shared/api';
import { TOGGLE_FAVORITE, GET_ALL_PLACES } from 'shared/query/apolloQueries';
import { type PlaceResponse } from 'shared/types';

interface PlacesData {
  places: PlaceResponse[];
}

export const useToggleFavorite = (placeId: string | null) => {
  const { user, setAuthModalContentVariant } = useAuth();
  const [toastMessage, setToastMessage] = useState<string>('');

  const [toggleFavoriteMutation] = useMutation<{ toggleFavorite: boolean }>(TOGGLE_FAVORITE, {
    update(cache, { data }) {
      if (data?.toggleFavorite) {
        updateAllPlacesCache(cache);
      }
    },
  });

  const updateAllPlacesCache = (cache: ApolloCache<unknown>) => {
    const existingData = cache.readQuery<PlacesData>({ query: GET_ALL_PLACES });

    if (existingData?.places) {
      const updatedPlaces = existingData.places.map((place) => {
        if (place.properties.id === placeId) {
          if (!place.properties.isFavorite) {
            setToastMessage(`${place.properties.name} was added to favorites`);
          } else {
            setToastMessage(`${place.properties.name} was removed from favorites`);
          }
          return {
            ...place,
            properties: {
              ...place.properties,
              isFavorite: !place.properties.isFavorite,
            },
          };
        }
        return place;
      });

      cache.writeQuery({
        query: GET_ALL_PLACES,
        data: { places: updatedPlaces },
      });
    }
  };

  const toggleFavorite = async () => {
    if (!placeId) return;
    if (!user) {
      setAuthModalContentVariant('LoginRequired');
      return;
    }
    try {
      await toggleFavoriteMutation({
        variables: { placeId },
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  return { toggleFavorite, toastMessage };
};
