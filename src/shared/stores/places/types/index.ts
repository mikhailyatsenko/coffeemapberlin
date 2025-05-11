import { type GetAllPlacesQuery } from 'shared/generated/graphql';

export type Place = GetAllPlacesQuery['places'][number];

export interface Filters {
  searchTerm: string;
  minRating?: number;
  sortOrder: 'asc' | 'desc';
}

export interface PlacesState {
  places: Place[];
  favoritePlaces: Place[] | null;
  filters: Filters;
}
