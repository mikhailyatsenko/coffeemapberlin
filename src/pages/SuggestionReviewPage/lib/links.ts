import { generatePath } from 'react-router-dom';
import { IMAGEKIT_CDN_URL, RoutePaths } from 'shared/constants';

export const placePath = (placeId: string) => generatePath(`/${RoutePaths.placePage}`, { id: placeId });

/** Opens the Place a Google Place ID points to in Google Maps, so the admin can check it's the right one. */
export const googleMapsUrl = (googleId: string) =>
  `https://www.google.com/maps/place/?q=place_id:${encodeURIComponent(googleId)}`;

/** A suggestion photo's ImageKit path (it starts with "/") as a thumbnail URL. */
export const photoThumbnailUrl = (path: string) => `${IMAGEKIT_CDN_URL}${path}?tr=w-320,h-320`;
