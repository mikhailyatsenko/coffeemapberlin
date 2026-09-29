import { type CharacteristicCounts } from 'shared/generated/graphql';

/** Stands in for `characteristicCounts` when a resolver returns `null` (`places`, `filteredPlaces`, `neighborhoodShortlists`). */
export const ZERO_CHARACTERISTIC_COUNTS: CharacteristicCounts = {
  affordablePrices: { pressed: false, count: 0 },
  deliciousFilterCoffee: { pressed: false, count: 0 },
  freeWifi: { pressed: false, count: 0 },
  friendlyStaff: { pressed: false, count: 0 },
  outdoorSeating: { pressed: false, count: 0 },
  petFriendly: { pressed: false, count: 0 },
  pleasantAtmosphere: { pressed: false, count: 0 },
  yummyEats: { pressed: false, count: 0 },
};
