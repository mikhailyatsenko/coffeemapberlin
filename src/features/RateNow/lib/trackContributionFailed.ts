import { trackEvent } from 'shared/lib/analytics';

import { type Actor } from './getActor';
import { getSaveErrorReason } from './getSaveErrorReason';

/** Sends `contribution_failed` for a Rating or Characteristic that failed to save. */
export const trackContributionFailed = (
  placeId: string,
  actor: Actor,
  kind: 'rating' | 'characteristic',
  error: unknown,
) => {
  trackEvent('contribution_failed', { place_id: placeId, actor, kind, reason: getSaveErrorReason(error) });
};
