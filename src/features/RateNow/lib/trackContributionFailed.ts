import { trackEvent } from 'shared/lib/analytics';
import { getSaveErrorReason } from 'shared/lib/saveError';

import { type Actor } from './getActor';

/** Sends `contribution_failed` for a Rating or Characteristic that failed to save. */
export const trackContributionFailed = (
  placeId: string,
  actor: Actor,
  kind: 'rating' | 'characteristic',
  error: unknown,
) => {
  trackEvent('contribution_failed', { place_id: placeId, actor, kind, reason: getSaveErrorReason(error) });
};
