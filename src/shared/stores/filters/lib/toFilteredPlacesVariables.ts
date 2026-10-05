import { type FilteredPlacesQueryVariables } from 'shared/generated/graphql';
import { type FiltersState } from '../types';

/** The `filteredPlaces` query variables for the Filters; an unset Filter is left out. */
export const toFilteredPlacesVariables = ({
  minRating,
  neighborhood,
  selectedTags,
}: Pick<FiltersState, 'minRating' | 'neighborhood' | 'selectedTags'>): FilteredPlacesQueryVariables => ({
  minRating: minRating > 0 ? minRating : undefined,
  neighborhood: neighborhood.length > 0 ? neighborhood : undefined,
  additionalInfo: selectedTags.length > 0 ? selectedTags : undefined,
});
