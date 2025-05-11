import { createContext } from 'react';
import { type GetAllPlacesQuery } from 'shared/generated/graphql';

interface PlacesContextType {
  filterablePlaces: GetAllPlacesQuery['places'];
  favoritePlaces: GetAllPlacesQuery['places'] | null;
  setSearchTerm: (term: string) => void;
  setMinRating: (rating: number) => void;
  setShowFavorite: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  minRating: number;
  showFavorites: boolean;
}
export const PlacesDataContext = createContext<PlacesContextType | undefined>(undefined);
