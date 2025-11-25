import { type GetOnlyGeoPlacesQuery, type GetPlacesQuery } from 'shared/generated/graphql';

export interface PlacesDataWithGeo {
  type: 'FeatureCollection';
  features: GetPlacesQuery['places']['places'] | GetOnlyGeoPlacesQuery['places']['places'];
}
export interface LoadMapProps {
  placesGeo: PlacesDataWithGeo;
}
