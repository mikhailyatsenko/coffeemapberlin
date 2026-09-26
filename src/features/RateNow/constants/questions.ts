import { Characteristic } from 'shared/generated/graphql';

/** How the person is asked about each Characteristic. */
export const QUESTION_TEXT: Record<Characteristic, string> = {
  [Characteristic.deliciousFilterCoffee]: 'Delicious filter coffee?',
  [Characteristic.pleasantAtmosphere]: 'Pleasant atmosphere?',
  [Characteristic.yummyEats]: 'Yummy eats?',
  [Characteristic.friendlyStaff]: 'Friendly staff?',
  [Characteristic.affordablePrices]: 'Affordable prices?',
  [Characteristic.freeWifi]: 'Free Wi-Fi?',
  [Characteristic.outdoorSeating]: 'Outdoor seating?',
  [Characteristic.petFriendly]: 'Pet friendly?',
};

/**
 * The opinion Characteristics the block asks about, in the order asked. Free Wi-Fi,
 * outdoor seating and pet friendly are left out: Amenities cover them. Shortlist
 * cards ask about one Characteristic each, from `QUESTION_TEXT`.
 */
export const QUESTIONS: ReadonlyArray<{ characteristic: Characteristic; text: string }> = [
  Characteristic.deliciousFilterCoffee,
  Characteristic.pleasantAtmosphere,
  Characteristic.yummyEats,
  Characteristic.friendlyStaff,
  Characteristic.affordablePrices,
].map((characteristic) => ({ characteristic, text: QUESTION_TEXT[characteristic] }));

/** How many questions show at once. */
export const QUESTION_BATCH_SIZE = 3;
