import { create } from 'zustand';
import { type FiltersState } from '../types';

export const useFiltersStore = create<FiltersState>(() => ({
  minRating: 0,
  neighborhood: [],
  selectedTags: [],
  isFilterPanelOpen: false,
}));
