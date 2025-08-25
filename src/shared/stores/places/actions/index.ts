import { usePlacesStore } from '../hooks';
import { type PlacesState, type Place } from '../types';

export const setPlaces = (places: Place[] | ((prev: Place[]) => Place[])) => {
  usePlacesStore.setState((state) => ({
    places: typeof places === 'function' ? places(state.places) : places,
  }));
};

export const setShowFavorites = (show: boolean) => {
  usePlacesStore.setState({ showFavorites: show });
};

export const setFilteredPlaces = (
  filter: { searchTerm: string; minRating: number } | null = {
    searchTerm: '',
    minRating: 0,
  },
) => {
  if (filter === null) {
    usePlacesStore.setState({ filteredPlaces: null });
    return;
  }
  usePlacesStore.setState((state) => {
    const filteredPlaces = state.places
      .filter(
        (place) =>
          place.properties.name.toLocaleLowerCase().includes(filter.searchTerm.toLocaleLowerCase().trim()) &&
          (place.properties.averageRating ?? 0) >= filter.minRating,
      )
      .sort((a, b) => (b?.properties?.averageRating ?? 0) - (a?.properties?.averageRating ?? 0));

    return {
      filteredPlaces,
    };
  });
};

export const toggleFavorite = (placeId: string) => {
  usePlacesStore.setState((state) => {
    const updatedPlaces = state.places.map((place) =>
      place.id === placeId
        ? {
            ...place,
            properties: {
              ...place.properties,
              isFavorite: !place.properties.isFavorite,
            },
          }
        : place,
    );
    return { places: updatedPlaces };
  });
};

export const setCurrentPlacePosition = (position: PlacesState['currentPlacePosition']) => {
  usePlacesStore.setState({ currentPlacePosition: position });
};
