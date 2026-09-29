import { type ApolloCache } from '@apollo/client';
import { ZERO_CHARACTERISTIC_COUNTS } from 'shared/constants';
import {
  useToggleCharacteristicMutation,
  type Characteristic,
  PlaceDocument,
  type PlaceQuery,
} from 'shared/generated/graphql';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { useAuthStore } from 'shared/stores/auth';

export const useToggleCharacteristic = (placeId: string) => {
  const user = useAuthStore((s) => s.user);

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
    const place = existingData?.place;
    if (!place) return;

    // Same zero baseline the Place page renders from when characteristicCounts came back null,
    // so the toggle still lands in the cache instead of silently doing nothing.
    const characteristicCounts = place.properties.characteristicCounts ?? ZERO_CHARACTERISTIC_COUNTS;
    const currentCharacteristic = characteristicCounts[characteristic];
    cache.writeQuery<PlaceQuery>({
      query: PlaceDocument,
      variables: { placeId },
      data: {
        place: {
          ...place,
          properties: {
            ...place.properties,
            characteristicCounts: {
              ...characteristicCounts,
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
  };

  /**
   * Rethrows on failure so the caller can show it. The optimistic toggle needs
   * no manual undo: Apollo drops the optimistic layer when the mutation fails.
   */
  const toggleChar = async (characteristic: Characteristic) => {
    try {
      const guestCredentials = user ? {} : await ensureGuestIdentity();

      await toggleCharacteristic({
        variables: { placeId, characteristic, ...guestCredentials },
      });
    } catch (error) {
      console.error('Error toggling characteristic:', error);
      throw error;
    }
  };

  return { toggleChar, error };
};
