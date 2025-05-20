import { create } from 'zustand';

import { type PlacesState } from '../types';

export const usePlacesStore = create<PlacesState>(() => ({
  places: [],
  filteredPlaces: null,
  showFavorites: false,
  currentPlacePosition: null,
}));
