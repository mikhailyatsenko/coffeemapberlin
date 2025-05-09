import { type Point } from 'geojson';
import { createContext } from 'react';
import { type GetAllPlacesQuery } from 'shared/generated/graphql';

export interface GeoPlaces extends Omit<GetAllPlacesQuery['places'], 'geometry' | 'type'> {
  type: 'Feature';
  geometry: Point;
}

interface PlacesContextType {
  places: GeoPlaces;
  filterablePlaces: GeoPlaces;
  favoritePlaces: GeoPlaces | null;
  setSearchTerm: (term: string) => void;
  setMinRating: (rating: number) => void;
  setShowFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  minRating: number;
  loading: boolean;
  showFavorites: boolean;
}
export const PlacesDataContext = createContext<PlacesContextType | undefined>(undefined);
