import { type ApolloCache } from '@apollo/client';
import {
  GetAllPlacesDocument,
  type GetAllPlacesQuery,
  useToggleCharacteristicMutation,
  type Characteristic,
} from 'shared/generated/graphql';
import { useAuth } from 'shared/hooks';

import { type ICharacteristicCounts } from 'shared/types';

export const useToggleCharacteristic = (placeId: string) => {
  const { user, setAuthModalContentVariant } = useAuth();

  const [toggleCharacteristic, { error }] = useToggleCharacteristicMutation({
    optimisticResponse: {
      toggleCharacteristic: {
        success: true,
      },
    },

    update(cache, _, { variables }) {
      const characteristic = variables?.characteristic;
      if (characteristic) {
        updateAllPlacesCache(cache, placeId, characteristic);
      }
    },
  });

  const updateAllPlacesCache = (
    cache: ApolloCache<unknown>,
    placeId: string,
    characteristic: keyof ICharacteristicCounts,
  ) => {
    const existingData = cache.readQuery<GetAllPlacesQuery>({ query: GetAllPlacesDocument });

    if (existingData?.places) {
      const updatedPlaces = existingData.places.map((place) => {
        if (place.properties.id === placeId) {
          const currentCharacteristic = place.properties.characteristicCounts[characteristic];

          return {
            ...place,
            properties: {
              ...place.properties,
              characteristicCounts: {
                ...place.properties.characteristicCounts,
                [characteristic]: {
                  ...currentCharacteristic,
                  pressed: !currentCharacteristic.pressed,
                  count: currentCharacteristic.pressed
                    ? currentCharacteristic.count - 1
                    : currentCharacteristic.count + 1,
                },
              },
            },
          };
        }
        return place;
      });

      cache.writeQuery({
        query: GetAllPlacesDocument,
        data: { places: updatedPlaces },
      });
    }
  };

  const toggleChar = async (characteristic: Characteristic) => {
    if (!user) {
      setAuthModalContentVariant('LoginRequired');
      return;
    }
    try {
      await toggleCharacteristic({
        variables: { placeId, characteristic },
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  return { toggleChar, error };
};
