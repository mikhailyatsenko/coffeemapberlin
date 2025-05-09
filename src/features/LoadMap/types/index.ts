import { type GetAllPlacesQuery } from 'shared/generated/graphql';

export interface PlacesDataWithGeo {
  type: 'FeatureCollection';
  features: GetAllPlacesQuery['places'];
}
export interface LoadMapProps {
  placesGeo: PlacesDataWithGeo;
}
