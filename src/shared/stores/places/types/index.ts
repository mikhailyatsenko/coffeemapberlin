import { type Position } from 'geojson';
import { type GetPlacesQuery } from 'shared/generated/graphql';

export type Place = GetPlacesQuery['places']['places'][number];

export interface PlacesState {
  places: Place[];
  filteredPlaces: Place[] | null;
  showFavorites: boolean;
  currentPlacePosition: Position | null;
  // Добавляем состояние загрузки
  isInitialLoading: boolean;
  isMoreDataLoading: boolean;
  isInitialLoadComplete: boolean;
  isMoreDataLoaded: boolean;
  fetchMoreInProgress: boolean;
}
