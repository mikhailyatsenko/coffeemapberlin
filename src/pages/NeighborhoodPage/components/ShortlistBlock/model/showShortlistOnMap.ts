import { setFilters, setSearchQuery } from 'shared/stores/filters';
import { setShowFavorites } from 'shared/stores/places';
import { SHORTLIST_MIN_RATING } from '../../../constants';
import { type NeighborhoodShortlist } from '../../../types';

/**
 * Sets the map to show exactly the Shortlist's Places: its Neighborhood, its
 * Amenities and the minimum Rating as Filters, with no Search or Favorites on top.
 */
export const showShortlistOnMap = (neighborhood: string, shortlist: Pick<NeighborhoodShortlist, 'amenities'>) => {
  setFilters({ neighborhood: [neighborhood], selectedTags: shortlist.amenities, minRating: SHORTLIST_MIN_RATING });
  setSearchQuery('');
  setShowFavorites(false);
};
