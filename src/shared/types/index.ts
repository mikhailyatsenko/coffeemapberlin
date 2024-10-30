import { type Point } from 'geojson';

export interface PlaceProperties {
  id: string;
  name: string;
  description: string;
  address: string;
  image?: string;
  instagram: string;
  averageRating: number;
  userRating: number;
  ratingCount: number;
  favoriteCount: number;
  isFavorite: boolean;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatar: string | null;
  createdAt: Date | null;
  isGoogleUserUserWithoutPassword: boolean;
}
export interface PlaceResponse {
  type: 'Feature';
  geometry: Point;
  properties: PlaceProperties;
}

export interface Review {
  id: string;
  text: string;
  userId: string;
  userRating?: number;
  userName: string;
  userAvatar: string;
  placeId: string;
  createdAt: string;
  isOwnReview: boolean;
}
