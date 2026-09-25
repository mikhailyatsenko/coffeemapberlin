import { useRef, useState } from 'react';
import { PlaceDocument, PlaceReviewsDocument, useAddRatingMutation } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { getSaveErrorMessage } from 'shared/lib/saveError';
import { useAuthStore } from 'shared/stores/auth';
import { revalidatePlaces } from 'shared/stores/places';

import { getActor } from '../lib/getActor';
import { trackContributionFailed } from '../lib/trackContributionFailed';
import { type OneTapRatingProps } from '../types';

/**
 * Saves a Rating on one tap. The tapped Rating shows at once; a failure puts the
 * previous one back and returns a message. Needs no Place page query in the cache.
 */
export const useOneTapRating = ({ placeId, rating, onRate, onSaved, onFailed }: OneTapRatingProps) => {
  const user = useAuthStore((s) => s.user);
  const [pendingRating, setPendingRating] = useState<number | null>(null);
  const [savedRating, setSavedRating] = useState<number | null>(null);
  // Once the caller passes a different current Rating (refetched, or changed elsewhere), it wins.
  const [ratingFromCaller, setRatingFromCaller] = useState(rating);
  if (rating !== ratingFromCaller) {
    setRatingFromCaller(rating);
    setSavedRating(null);
  }
  const [error, setError] = useState<string | null>(null);
  // A ref, not state: taps arriving in the same tick must see the save as started.
  const isSavingRef = useRef(false);
  const [addRating] = useAddRatingMutation({
    onCompleted() {
      revalidatePlaces();
    },
  });

  const confirmedRating = savedRating ?? rating ?? null;

  const saveRating = async (newRating: number) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setPendingRating(newRating);
    onRate?.(newRating);
    const actor = getActor(user);
    try {
      // Guests rate too; the captcha runs once, when the identity is issued.
      const guestCredentials = user ? {} : await ensureGuestIdentity();

      const { data } = await addRating({
        variables: { placeId, rating: newRating, ...guestCredentials },
        // In the background: the Rating already shows, and callers may have no Place page open.
        refetchQueries: [
          { query: PlaceDocument, variables: { placeId } },
          { query: PlaceReviewsDocument, variables: { placeId } },
        ],
      });
      setSavedRating(newRating);
      setError(null);
      trackEvent('rating_saved', {
        place_id: placeId,
        actor,
        rating: newRating,
        is_change: confirmedRating !== null,
      });
      const reviewId = data?.addRating.reviewId;
      if (reviewId) onSaved?.(newRating, reviewId);
    } catch (saveError) {
      console.error('Error adding rating:', saveError);
      setError(getSaveErrorMessage(saveError));
      trackContributionFailed(placeId, actor, 'rating', saveError);
      onFailed?.();
    } finally {
      setPendingRating(null);
      isSavingRef.current = false;
    }
  };

  return { shownRating: pendingRating ?? confirmedRating, isSaving: pendingRating !== null, error, saveRating };
};
