import { useQuery } from '@apollo/client';
import { GetAllPlacesDocument, type GetAllPlacesQuery } from 'shared/generated/graphql';

export const usePlaceData = (placeId: string | null) => {
  const { data, loading, error } = useQuery<GetAllPlacesQuery>(GetAllPlacesDocument, {
    skip: !placeId,
  });

  const place = data?.places.find((p) => p.properties.id === placeId);

  return { data: place, loading, error };
};
