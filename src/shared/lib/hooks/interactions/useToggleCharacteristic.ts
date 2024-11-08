import { type ApolloCache, useMutation } from '@apollo/client';
// import { useState } from 'react';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';

import { TOGGLE_CHARACTERISTIC, GET_ALL_PLACES } from 'shared/query/apolloQueries';
import { type ICharacteristicCounts, type PlaceResponse } from 'shared/types';

interface ToggleCharacteristicVariables {
  placeId: string;
  characteristic: keyof ICharacteristicCounts;
}

export const useToggleCharacteristic = (placeId: string) => {
  const { user, setIsAuthPopup } = useAuth();
  // const [toastMessage, setToastMessage] = useState<string>('');

  const [toggleCharacteristic, { error }] = useMutation<
    { toggleCharacteristic: { success: boolean } },
    ToggleCharacteristicVariables
  >(TOGGLE_CHARACTERISTIC, {
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

  interface PlacesData {
    places: PlaceResponse[];
  }

  const updateAllPlacesCache = (
    cache: ApolloCache<unknown>,
    placeId: string,
    characteristic: keyof ICharacteristicCounts,
  ) => {
    const existingData = cache.readQuery<PlacesData>({ query: GET_ALL_PLACES });

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
        query: GET_ALL_PLACES,
        data: { places: updatedPlaces },
      });
    }
  };

  const toggleFavorite = async (characteristic: keyof ICharacteristicCounts) => {
    if (!user) {
      setIsAuthPopup('LoginRequired');
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

  return { toggleFavorite, error };
};
