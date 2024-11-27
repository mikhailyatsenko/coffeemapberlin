import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { PlacesDataContext } from 'shared/lib/reactContext/PlacesData/PlacesContext';
import { GET_ALL_PLACES } from 'shared/query/apolloQueries';
import { type PlaceResponse } from 'shared/types';

interface PlacesData {
  places: PlaceResponse[];
}

export const PlacesDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, loading } = useQuery<PlacesData>(GET_ALL_PLACES);
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
