import { type NeighborhoodNumbers } from '../types';

/** "72 Places · 41 rated 4.5+"; the 4.5+ part is left out when no Place has it. */
export const formatNeighborhoodNumbers = ({ placesTotal, topRatedTotal }: NeighborhoodNumbers) => {
  const places = `${placesTotal} Place${placesTotal === 1 ? '' : 's'}`;
  return topRatedTotal > 0 ? `${places} · ${topRatedTotal} rated 4.5+` : places;
};
