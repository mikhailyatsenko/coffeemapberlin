import { DEFAULT_FILTERS } from '../constants';
import { usePlacesStore } from '../hooks';
import { type Filters, type Place } from '../types';

export const setPlaces = (places: Place[]) => {
  usePlacesStore.setState({ places });
};

export const setFavoritePlaces = (favoritePlaces: Place[]) => {
  usePlacesStore.setState({ favoritePlaces, filters: DEFAULT_FILTERS });
};

export const setFilters = (filters: Filters) => {
  usePlacesStore.setState({ filters });
};
