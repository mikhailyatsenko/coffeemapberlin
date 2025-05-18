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
  image: string;
  instagram: string;
  averageRating?: number | null;
  ratingCount: number;
  favoriteCount: number;
  isFavorite: boolean;
  characteristicCounts: ICharacteristicCounts;
}

export interface User {
  id: string;
  displayName: string;
  email: string;
  avatar?: string;
  createdAt?: Date;
  isGoogleUserUserWithoutPassword: boolean;
}
