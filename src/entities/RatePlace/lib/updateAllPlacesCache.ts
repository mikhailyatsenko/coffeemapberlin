import { type ApolloCache } from '@apollo/client';
import { GetAllPlacesDocument, type GetAllPlacesQuery } from 'shared/generated/graphql';

import { type ICharacteristicCounts } from 'shared/types';

export const updateAllPlacesCache = (
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
