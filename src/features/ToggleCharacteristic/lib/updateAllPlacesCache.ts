import { type ApolloCache } from '@apollo/client';
import { GET_ALL_PLACES } from 'shared/query/apolloQueries';
import { type ICharacteristicCounts, type PlaceResponse } from 'shared/types';

interface PlacesData {
  places: PlaceResponse[];
}

export const updateAllPlacesCache = (
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
