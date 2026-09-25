import { useState } from 'react';

/**
 * Whether the rate block can show for this Place: once its own Reviews have loaded, or failed to.
 * Latched per Place: a later refetch (e.g. after sign-in) must not unmount the block and count a second view,
 * but moving to another Place waits for that Place's own Review, so a returning person sees their Rating first.
 */
export const useShowsRateBlock = ({
  placeId,
  hasReviews,
  hasReviewsError,
}: {
  placeId: string;
  hasReviews: boolean;
  hasReviewsError: boolean;
}) => {
  const [loadedPlaceId, setLoadedPlaceId] = useState<string | null>(null);
  if (hasReviews && loadedPlaceId !== placeId) setLoadedPlaceId(placeId);
  return hasReviews || loadedPlaceId === placeId || hasReviewsError;
};
