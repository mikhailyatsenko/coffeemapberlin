import { type ReactNode } from 'react';
import { type FilteredPlacesQuery } from 'shared/generated/graphql';

type NeighborhoodPlace = FilteredPlacesQuery['filteredPlaces']['places'][number];

export interface NeighborhoodPlaceCardProps {
  place: NeighborhoodPlace;
  /** Called when the card opens the Place page. */
  onOpen?: () => void;
}

export interface NeighborhoodPlaceRowProps {
  place: NeighborhoodPlace;
  /** Called when the row opens the Place page. */
  onOpen?: () => void;
  /** Where people rate the Place, e.g. the one-tap beans; taps in it don't open the Place page. */
  contribution?: ReactNode;
}
