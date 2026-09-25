import { Characteristic } from 'shared/generated/graphql';

import { QUESTIONS } from '../../../constants/questions';

/** The order of the chips: the opinion Characteristics as asked, then the Amenities the block never asks. */
export const MARKS_ORDER: readonly Characteristic[] = [
  ...QUESTIONS.map(({ characteristic }) => characteristic),
  Characteristic.freeWifi,
  Characteristic.outdoorSeating,
  Characteristic.petFriendly,
];
