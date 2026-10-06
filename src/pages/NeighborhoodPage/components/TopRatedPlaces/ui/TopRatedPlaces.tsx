import { useMemo } from 'react';
import { TOP_RATED_MIN_RATING } from '../../../constants';
import { sortPlaces } from '../../../lib/sortPlaces';
import { showNeighborhoodOnMap } from '../../../model/showNeighborhoodOnMap';
import { type NeighborhoodPlace } from '../../../types';
import { Shelf } from '../../Shelf';
import { TOP_RATED_SHELF_SIZE } from '../constants';

interface TopRatedPlacesProps {
  /** Every Place with an Average rating of 4.5 or higher. */
  places: readonly NeighborhoodPlace[];
  /** The Neighborhood's name as the map's Filters know it. */
  neighborhood: string;
  onCardOpen: () => void;
  onMapOpen: () => void;
}

/** The 6 best Places rated 4.5 or higher and a link to all of them on the map; left out when there are none. */
export const TopRatedPlaces = ({ places, neighborhood, onCardOpen, onMapOpen }: TopRatedPlacesProps) => {
  const bestPlaces = useMemo(() => sortPlaces(places).slice(0, TOP_RATED_SHELF_SIZE), [places]);
  if (bestPlaces.length === 0) return null;
  return (
    <Shelf
      id="top-rated"
      title="Top rated"
      places={bestPlaces}
      columns={3}
      mapCount={places.length}
      onMapOpen={() => {
        showNeighborhoodOnMap(neighborhood, { minRating: TOP_RATED_MIN_RATING });
        onMapOpen();
      }}
      onCardOpen={onCardOpen}
    />
  );
};
