import { useQuery } from '@apollo/client';
import { GetAllPlacesDocument, type GetAllPlacesQuery } from 'shared/generated/graphql';

export const useAllPlaces = () => {
  const { data, loading } = useQuery<GetAllPlacesQuery>(GetAllPlacesDocument);
  return { data: data?.places, loading };
};
