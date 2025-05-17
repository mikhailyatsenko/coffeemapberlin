import { usePlacesStore } from '../hooks';
import { type Place } from '../types';

export const setPlaces = (places: Place[]) => {
  usePlacesStore.setState({ places });
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
      filteredPlaces: filteredPlaces.length > 0 ? filteredPlaces : null,
    };
  });
};
