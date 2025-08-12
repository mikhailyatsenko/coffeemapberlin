import { type ApolloCache } from '@apollo/client';
import { PlaceDocument, type PlaceQuery, type Characteristic } from 'shared/generated/graphql';

export const updateAllPlacesCache = (
  cache: ApolloCache<unknown>,
  placeId: string,
  characteristic: Characteristic,
) => {
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
