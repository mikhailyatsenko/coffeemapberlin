import { type Point } from 'geojson';

export interface CharacteristicData {
  pressed: boolean;
  count: number;
}

export interface ICharacteristicCounts {
  deliciousFilterCoffee: CharacteristicData;
  pleasantAtmosphere: CharacteristicData;
  friendlyStaff: CharacteristicData;
  freeWifi: CharacteristicData;
  yummyEats: CharacteristicData;
  affordablePrices: CharacteristicData;
  petFriendly: CharacteristicData;
  outdoorSeating: CharacteristicData;
}

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
  characteristicCounts: ICharacteristicCounts;
}

export interface PlaceResponse {
  type: 'Feature';
  geometry: Point;
  properties: PlaceProperties;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatar: string | null;
  createdAt: Date | null;
  isGoogleUserUserWithoutPassword: boolean;
}

export interface Review {
  id: string;
  text: string;
  userId: string;
  userRating: number | null;
  userName: string;
  userAvatar: string;
  placeId: string;
  createdAt: string;
  isOwnReview: boolean;
}
