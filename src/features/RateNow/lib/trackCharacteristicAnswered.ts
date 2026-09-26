import { type Characteristic } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';

import { type SurfaceParams } from '../types';

import { type Actor } from './getActor';

/** Sends `characteristic_answered` for a Yes that saved or a Skip. */
export const trackCharacteristicAnswered = (
  placeId: string,
  actor: Actor,
  surfaceParams: SurfaceParams,
  { characteristic, answer }: { characteristic: Characteristic; answer: 'yes' | 'skip' },
) => {
  trackEvent('characteristic_answered', { place_id: placeId, actor, characteristic, answer, ...surfaceParams });
};
