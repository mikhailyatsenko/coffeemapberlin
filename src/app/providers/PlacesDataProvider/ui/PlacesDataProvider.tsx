import React, { useState } from 'react';
import { PlacesDataContext } from 'shared/context/PlacesData/PlacesContext';
import { usePlacesStore } from 'shared/stores/places';

export const PlacesDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFavorites, setShowFavorite] = useState<boolean>(false);

  const places = usePlacesStore((state) => state.places);

  const favoritePlaces = places.filter((place) => place.properties.isFavorite);

  return (
    <PlacesDataContext.Provider
      value={{
        filterablePlaces: places,
        setMinRating,
        setSearchTerm,
        searchTerm,
        favoritePlaces,
        setShowFavorite,
        showFavorites,
        minRating,
      }}
    >
      {children}
    </PlacesDataContext.Provider>
  );
};
