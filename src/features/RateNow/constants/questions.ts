import { Characteristic } from 'shared/generated/graphql';

/**
 * The opinion Characteristics the block asks about, in the order asked. Free Wi-Fi,
 * outdoor seating and pet friendly are left out: Amenities cover them.
 */
export const QUESTIONS: ReadonlyArray<{ characteristic: Characteristic; text: string }> = [
  { characteristic: Characteristic.deliciousFilterCoffee, text: 'Delicious filter coffee?' },
  { characteristic: Characteristic.pleasantAtmosphere, text: 'Pleasant atmosphere?' },
  { characteristic: Characteristic.yummyEats, text: 'Yummy eats?' },
  { characteristic: Characteristic.friendlyStaff, text: 'Friendly staff?' },
  { characteristic: Characteristic.affordablePrices, text: 'Affordable prices?' },
];

/** How many questions show at once. */
export const QUESTION_BATCH_SIZE = 3;
