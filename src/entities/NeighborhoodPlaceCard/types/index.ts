import { type FilteredPlacesQuery } from 'shared/generated/graphql';

export interface NeighborhoodPlaceCardProps {
  place: FilteredPlacesQuery['filteredPlaces']['places'][number];
  /** Called when the card opens the Place page. */
  onOpen?: () => void;
}
