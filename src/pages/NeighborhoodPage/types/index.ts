import { type ReactElement } from 'react';
import { type FilteredPlacesQuery, type NeighborhoodShortlistsQuery, type ShortlistId } from 'shared/generated/graphql';

export interface NeighborhoodPageProps {
  /** Shown when the Neighborhood is unknown. */
  notFound: ReactElement;
}

export type NeighborhoodPlace = FilteredPlacesQuery['filteredPlaces']['places'][number];

export type NeighborhoodShortlist = NeighborhoodShortlistsQuery['neighborhoodShortlists'][number];

/** The page section a card sits in, as sent with `neighborhood_card_click`. */
export type NeighborhoodSection = 'top_rated' | ShortlistId | 'all';
