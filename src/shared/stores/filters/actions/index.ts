import { useFiltersStore } from '../hooks';

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

export const resetFilters = () => {
  useFiltersStore.setState({
    minRating: 0,
    neighborhood: [],
    selectedTags: [],
  });
};
