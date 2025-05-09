import React, { useState } from 'react';
import { PlacesDataContext } from 'shared/context/PlacesData/PlacesContext';
import { useGetAllPlacesQuery } from 'shared/generated/graphql';

export const PlacesDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, loading } = useGetAllPlacesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState(0);
  const [showFavorites, setShowFavorite] = useState<boolean>(false);

  const places = data?.places ?? [];

  const filterablePlaces = places.filter(
    (place) =>
      place.properties.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) &&
      (place.properties.averageRating || 0) >= minRating,
  );

  const favoritePlaces = places.filter((place) => place.properties.isFavorite);

  return (
    <PlacesDataContext.Provider
      value={{
        places,
        filterablePlaces,
        setMinRating,
        setSearchTerm,
        searchTerm,
        favoritePlaces,
        setShowFavorite,
        showFavorites,
        minRating,
        loading,
      }}
    >
      {children}
    </PlacesDataContext.Provider>
  );
};
