import { type ApolloCache } from '@apollo/client';
import {
  useToggleCharacteristicMutation,
  type Characteristic,
  PlaceDocument,
  type PlaceQuery,
} from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { showLoginRequired } from 'shared/stores/modal';

export const useToggleCharacteristic = (placeId: string) => {
  const { user } = useAuthStore();

  const [toggleCharacteristic, { error }] = useToggleCharacteristicMutation({
    optimisticResponse: {
      toggleCharacteristic: {
        success: true,
      },
    },

    update(cache, _, { variables }) {
      const characteristic = variables?.characteristic;
      if (characteristic) {
        updatePlaceCache(cache, placeId, characteristic);
      }
    },
  });

  const updatePlaceCache = (cache: ApolloCache<unknown>, placeId: string, characteristic: Characteristic) => {
    const existingData = cache.readQuery<PlaceQuery>({ query: PlaceDocument, variables: { placeId } });
    if (existingData?.place) {
      const currentCharacteristic = existingData.place.properties.characteristicCounts[characteristic];
      cache.writeQuery<PlaceQuery>({
        query: PlaceDocument,
        variables: { placeId },
        data: {
          place: {
            ...existingData.place,
            properties: {
              ...existingData.place.properties,
              characteristicCounts: {
                ...existingData.place.properties.characteristicCounts,
                [characteristic]: {
                  ...currentCharacteristic,
                  pressed: !currentCharacteristic.pressed,
                  count: currentCharacteristic.pressed
                    ? currentCharacteristic.count - 1
                    : currentCharacteristic.count + 1,
                },
              },
            },
          },
        },
      });
    }
  };

  const toggleChar = async (characteristic: Characteristic) => {
    if (!user) {
      showLoginRequired();
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
