import { BERLIN_BOUNDS } from '../constants';
import { type Coordinates } from '../types';

const LAT_LNG = /^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/;

/** Reads "lat, lng" as Google Maps copies it (spaces optional); null when it isn't that shape. */
export const parseCoordinates = (text: string): Coordinates | null => {
  const match = LAT_LNG.exec(text.trim());
  if (!match) return null;
  return { lat: Number(match[1]), lng: Number(match[2]) };
};

export const isInsideBerlin = ({ lat, lng }: Coordinates): boolean =>
  lat >= BERLIN_BOUNDS.minLat &&
  lat <= BERLIN_BOUNDS.maxLat &&
  lng >= BERLIN_BOUNDS.minLng &&
  lng <= BERLIN_BOUNDS.maxLng;
