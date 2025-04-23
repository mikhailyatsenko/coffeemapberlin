import { createContext } from 'react';
import { type PlaceResponse } from 'shared/types';

interface PlacesContextType {
  places: PlaceResponse[];
  filterablePlaces: PlaceResponse[];
  favoritePlaces: PlaceResponse[] | null;
  setSearchTerm: (term: string) => void;
  setMinRating: (rating: number) => void;
  setShowFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  minRating: number;
  loading: boolean;
  showFavorites: boolean;
}
export const PlacesDataContext = createContext<PlacesContextType | undefined>(undefined);
