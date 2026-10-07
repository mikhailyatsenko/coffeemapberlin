import { setFilters, setSearchQuery } from 'shared/stores/filters';
import { setShowFavorites } from 'shared/stores/places';

interface MapFilters {
  amenities?: string[];
  minRating?: number;
}

/**
 * Sets the map to show exactly these Places of the Neighborhood: the Neighborhood,
 * the Amenities and the minimum Rating as Filters, with no Search or Favorites on top.
 */
export const showNeighborhoodOnMap = (neighborhood: string, { amenities = [], minRating = 0 }: MapFilters = {}) => {
  setFilters({ neighborhood: [neighborhood], selectedTags: amenities, minRating });
  setSearchQuery('');
  setShowFavorites(false);
};
