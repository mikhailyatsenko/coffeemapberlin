import { type Characteristic, type CharacteristicCounts } from 'shared/generated/graphql';

import { QUESTIONS } from '../constants/questions';

/** The questions still to ask, in order: opinion Characteristics neither marked nor dismissed. */
export const getRemainingQuestions = (
  characteristicCounts: CharacteristicCounts,
  dismissed: readonly Characteristic[],
) =>
  QUESTIONS.filter(
    ({ characteristic }) => !characteristicCounts[characteristic].pressed && !dismissed.includes(characteristic),
  );
