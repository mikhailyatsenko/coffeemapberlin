import { trackEvent } from 'shared/lib/analytics';
import { type PhotoFailureReason } from 'shared/lib/photoUpload';
import { type SaveErrorReason } from 'shared/lib/saveError';

import { type Actor } from './getActor';

type ContributionFailure =
  | { kind: 'rating' | 'characteristic'; reason: SaveErrorReason }
  | { kind: 'photo'; reason: PhotoFailureReason };

/** Sends `contribution_failed` for a Rating, Characteristic or Photo that failed to save. */
export const trackContributionFailed = (placeId: string, actor: Actor, { kind, reason }: ContributionFailure) => {
  trackEvent('contribution_failed', { place_id: placeId, actor, kind, reason });
};
