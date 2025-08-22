import { usePlacesStore } from '../hooks';
import { type PlacesState, type Place } from '../types';

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

  const term = (filter.searchTerm ?? '').trim().toLowerCase();
  const minRating = filter.minRating ?? 0;

  usePlacesStore.setState((state) => {
    if (!state.places?.length) {
      return { filteredPlaces: null };
    }

    let filtered: Place[];
    if (term.length > 0 || minRating > 0) {
      filtered = state.places.filter((place) => {
        const name = (place.properties.name ?? '').toLowerCase();
        const rating = place.properties.averageRating ?? 0;
        const matchesName = term.length === 0 ? true : name.includes(term);
        const matchesRating = rating >= minRating;
        return matchesName && matchesRating;
      });
    } else {
      filtered = state.places.slice();
    }

    if (filtered.length <= 1) {
      return { filteredPlaces: filtered.length ? filtered : null };
    }

    const sorted = filtered.sort((a, b) => (b?.properties?.averageRating ?? 0) - (a?.properties?.averageRating ?? 0));

    return {
      filteredPlaces: sorted.length > 0 ? sorted : null,
    };
  });
};

export const setCurrentPlacePosition = (position: PlacesState['currentPlacePosition']) => {
  usePlacesStore.setState({ currentPlacePosition: position });
};
