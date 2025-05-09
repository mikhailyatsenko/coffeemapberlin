import { useQuery } from '@apollo/client';
import { type GeoPlaces } from 'shared/context/PlacesData/PlacesContext';
import { GetAllPlacesDocument, type GetAllPlacesQuery } from 'shared/generated/graphql';

export const useAllPlaces = () => {
  const { data, loading } = useQuery<GetAllPlacesQuery>(GetAllPlacesDocument);
  return { data: data?.places as GeoPlaces, loading };
};
