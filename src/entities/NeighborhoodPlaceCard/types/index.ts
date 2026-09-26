import { type ReactNode } from 'react';
import { type FilteredPlacesQuery } from 'shared/generated/graphql';

export interface NeighborhoodPlaceCardProps {
  place: FilteredPlacesQuery['filteredPlaces']['places'][number];
  /** Called when the card opens the Place page. */
  onOpen?: () => void;
  /** Shown under the Rating, e.g. the person's own Rating; taps in it don't open the Place page. */
  contribution?: ReactNode;
}
