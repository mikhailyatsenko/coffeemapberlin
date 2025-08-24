import { type ApolloCache } from '@apollo/client';
import toast from 'react-hot-toast';
import { GetPlacesDocument, useToggleFavoriteMutation, type GetPlacesQuery } from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { showLoginRequired } from 'shared/stores/modal';

export const useToggleFavorite = (placeId: string | null) => {
  const { user } = useAuthStore();

  const [toggleFavoriteMutation] = useToggleFavoriteMutation({
    update(cache, { data }) {
      if (data?.toggleFavorite) {
        updateAllPlacesCache(cache);
      }
    },
  });

  const updateAllPlacesCache = (cache: ApolloCache<unknown>) => {
    const existingData = cache.readQuery<GetPlacesQuery>({ query: GetPlacesDocument });

    if (existingData?.places) {
      const updatedPlaces = existingData.places.places.map((place) => {
        if (place.properties.id === placeId) {
          if (!place.properties.isFavorite) {
            toast(`${place.properties.name} has been added to favorites`);
          } else {
            toast(`${place.properties.name} has been removed from favorites`);
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
        query: GetPlacesDocument,
        data: { places: updatedPlaces },
      });
    }
  };

  const toggleFavorite = async () => {
    if (!placeId) return;
    if (!user) {
      showLoginRequired();
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

  return { toggleFavorite };
};
