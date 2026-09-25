import { useApolloClient } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useAddTextReviewMutation, PlaceReviewsDocument } from 'shared/generated/graphql';
import { ensureGuestIdentity, type GuestIdentity } from 'shared/lib/guest';
import { type UploadResult, type UploadTarget } from 'shared/lib/photoUpload';
import { useAuthStore } from 'shared/stores/auth';
import { showGuestReviewSubmitted } from 'shared/stores/modal';
import { useAddTextReviewDraftStore } from './draftStore';

interface UseSubmitReviewParams {
  placeId: string;
  /** Uploads the picked Photos to the saved Review. */
  uploadPhotos: (target: UploadTarget) => Promise<UploadResult>;
  onSubmitted?: () => void;
}

/** Saves the Review text, then uploads the picked Photos to that Review. */
export const useSubmitReview = ({ placeId, uploadPhotos, onSubmitted }: UseSubmitReviewParams) => {
  const client = useApolloClient();
  const user = useAuthStore((s) => s.user);
  const clearDraft = useAddTextReviewDraftStore((s) => s.clearDraft);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const [addTextReview, { loading: isSavingText, error: apolloError }] = useAddTextReviewMutation({
    awaitRefetchQueries: true,
  });

  useEffect(() => {
    if (apolloError) {
      setError(apolloError.message || 'Failed to submit review. Please try again.');
    }
  }, [apolloError]);

  const submit = useCallback(
    async (text: string) => {
      setError(null);
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      try {
        // Guests review under an identity issued after a captcha check; the
        // captcha runs here, on the first guest action, not on every submit.
        const guestCredentials: Partial<GuestIdentity> = user ? {} : await ensureGuestIdentity();

        const result = await addTextReview({
          variables: { placeId, text, ...guestCredentials },
          context: { fetchOptions: { signal } },
        });

        const reviewId = result.data?.addTextReview?.reviewId;

        if (reviewId) {
          const { failures, aborted } = await uploadPhotos({ reviewId, guestCredentials, signal });

          // The review itself is saved and consistent — it simply has fewer
          // photos than intended, so it is left in place either way.
          if (failures.length > 0 && !aborted) {
            toast.error('Some photos could not be uploaded');
          }
        }

        clearDraft(placeId);
        onSubmitted?.();

        await client.refetchQueries({ include: [PlaceReviewsDocument] });

        if (!user) {
          showGuestReviewSubmitted();
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        setError(err instanceof Error ? err.message : 'Failed to submit review. Please try again.');
        console.error('Error adding or updating review:', err);
      } finally {
        abortControllerRef.current = null;
      }
    },
    [user, addTextReview, placeId, uploadPhotos, clearDraft, onSubmitted, client],
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      toast.error('Submission cancelled by user');
    }
  }, []);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
    },
    [],
  );

  return { submit, cancel, isSavingText, error, setError };
};
