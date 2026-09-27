import { generatePath } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';

export const placePath = (placeId: string) => generatePath(`/${RoutePaths.placePage}`, { id: placeId });

/** Opens the Place a Google Place ID points to in Google Maps, so the admin can check it's the right one. */
export const googleMapsUrl = (googleId: string) =>
  `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(googleId)}`;
