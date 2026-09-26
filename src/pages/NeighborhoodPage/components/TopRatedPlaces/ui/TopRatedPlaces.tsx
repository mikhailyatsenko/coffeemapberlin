import { useMemo } from 'react';
import { sortPlaces } from '../../../lib/sortPlaces';
import { type NeighborhoodPlace } from '../../../types';
import { PlacesSection } from '../../PlacesSection';

interface TopRatedPlacesProps {
  places: readonly NeighborhoodPlace[];
  onCardOpen: () => void;
}

/** Places with an Average rating of 4.5 or higher; left out when there are none. */
export const TopRatedPlaces = ({ places, onCardOpen }: TopRatedPlacesProps) => {
  const sortedPlaces = useMemo(() => sortPlaces(places), [places]);
  if (sortedPlaces.length === 0) return null;
  return <PlacesSection id="top-rated" title="Top rated" places={sortedPlaces} onCardOpen={onCardOpen} />;
};
