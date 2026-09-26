import { useFiltersStore } from '../hooks';
import { type FiltersState } from '../types';

export const setMinRating = (minRating: number) => {
  useFiltersStore.setState({ minRating });
};

export const toggleNeighborhood = (neighborhood: string) => {
  useFiltersStore.setState((state) => {
    const isSelected = state.neighborhood.includes(neighborhood);
    return {
      neighborhood: isSelected
        ? state.neighborhood.filter((n) => n !== neighborhood)
        : [...state.neighborhood, neighborhood],
    };
  });
};

export const setNeighborhood = (neighborhood: string[]) => {
  useFiltersStore.setState({ neighborhood });
};

export const toggleTag = (tag: string) => {
  useFiltersStore.setState((state) => {
    const isSelected = state.selectedTags.includes(tag);
    return {
      selectedTags: isSelected ? state.selectedTags.filter((t) => t !== tag) : [...state.selectedTags, tag],
    };
  });
};

export const setSelectedTags = (tags: string[]) => {
  useFiltersStore.setState({ selectedTags: tags });
};

export const setFilterPanelOpen = (isOpen: boolean) => {
  useFiltersStore.setState({ isFilterPanelOpen: isOpen });
};

export const setSearchQuery = (searchQuery: string) => {
  useFiltersStore.setState({ searchQuery });
};

export const resetFilters = () => {
  setFilters({ minRating: 0, neighborhood: [], selectedTags: [] });
};

/** Replaces all three Filters at once. */
export const setFilters = ({
  minRating,
  neighborhood,
  selectedTags,
}: Pick<FiltersState, 'minRating' | 'neighborhood' | 'selectedTags'>) => {
  useFiltersStore.setState({ minRating, neighborhood, selectedTags });
};
