import { useRef, useState } from 'react';
import { PlaceDocument, PlaceReviewsDocument, useAddRatingMutation } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { useAuthStore } from 'shared/stores/auth';
import { revalidatePlaces } from 'shared/stores/places';

import { getSaveErrorMessage } from '../lib/getSaveErrorMessage';
import { getSaveErrorReason } from '../lib/getSaveErrorReason';
import { type OneTapRatingProps } from '../types';

/**
 * Saves a Rating on one tap. The tapped Rating shows at once; a failure puts the
 * previous one back and returns a message. Needs no Place page query in the cache.
 */
export const useOneTapRating = ({ placeId, rating, onSaved }: OneTapRatingProps) => {
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
    const actor = user ? 'user' : 'guest';
    try {
      // Guests rate too; the captcha runs once, when the identity is issued.
      const guestCredentials = user ? {} : await ensureGuestIdentity();

      await addRating({
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
      onSaved?.(newRating);
    } catch (saveError) {
      console.error('Error adding rating:', saveError);
      setError(getSaveErrorMessage(saveError));
      trackEvent('contribution_failed', {
        place_id: placeId,
        actor,
        kind: 'rating',
        reason: getSaveErrorReason(saveError),
      });
    } finally {
      setPendingRating(null);
      isSavingRef.current = false;
    }
  };

  return { shownRating: pendingRating ?? confirmedRating, isSaving: pendingRating !== null, error, saveRating };
};
