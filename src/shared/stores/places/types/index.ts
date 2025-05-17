import { type GetAllPlacesQuery } from 'shared/generated/graphql';

export type Place = GetAllPlacesQuery['places'][number];

export interface PlacesState {
  places: Place[];
  filteredPlaces: Place[] | null;
  showFavorites: boolean;
}
