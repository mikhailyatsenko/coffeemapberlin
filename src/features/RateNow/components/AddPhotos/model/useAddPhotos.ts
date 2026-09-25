import { useApolloClient } from '@apollo/client';
import { useRef, useState } from 'react';
import { PlaceReviewsDocument } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { ensureGuestIdentity } from 'shared/lib/guest';
import { usePhotoUpload } from 'shared/lib/photoUpload';
import { getSaveErrorReason } from 'shared/lib/saveError';
import { useAuthStore } from 'shared/stores/auth';

import { getActor } from '../../../lib/getActor';
import { type AddPhotosProps } from '../types';

/**
 * Uploads the picked Photos to the Review straight away, one batch per pick, and
 * refetches the Place reviews once a batch saves so the own Review card shows them.
 */
export const useAddPhotos = ({ placeId, reviewId, reviewPhotoCount, hasReviewText }: AddPhotosProps) => {
  const client = useApolloClient();
  const user = useAuthStore((s) => s.user);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Photos saved here that the caller's count already includes, known once the refetch after their batch lands.
  // The upload counts every Photo saved here, so the Review's other Photos are the caller's count without these.
  const [savedAndRefetched, setSavedAndRefetched] = useState(0);
  const { photos, room, roomNotice, isPreparing, isUploading, add, upload, failWaiting } = usePhotoUpload(
    Math.max(0, reviewPhotoCount - savedAndRefetched),
  );
  // From the pick to the batch settling, including the Guest identity check the upload starts with.
  const [isBatchRunning, setIsBatchRunning] = useState(false);

  // Photos saved here across batches; a ref, as a batch reads it after awaiting the upload.
  const savedRef = useRef(0);

  const isBusy = isBatchRunning || isPreparing || isUploading;
  const savedCount = photos.filter((photo) => photo.status === 'saved').length;

  const openPicker = () => {
    trackEvent('photo_button_click', { place_id: placeId, actor: getActor(user) });
    inputRef.current?.click();
  };

  const uploadPicked = async (files: File[]) => {
    if (!reviewId || !files.length) return;
    setIsBatchRunning(true);
    try {
      await add(files);

      let guestCredentials;
      try {
        // Reuses the Guest identity the Rating created, so there is no captcha again.
        guestCredentials = user ? {} : await ensureGuestIdentity();
      } catch (error) {
        console.error('Error adding photos:', error);
        failWaiting(getSaveErrorReason(error));
        return;
      }

      const { saved } = await upload({ reviewId, guestCredentials });
      if (saved === 0) return;

      trackEvent('photos_uploaded', {
        place_id: placeId,
        actor: getActor(user),
        count: saved,
        had_text: hasReviewText,
      });
      const savedSoFar = savedRef.current + saved;
      savedRef.current = savedSoFar;
      // In the background: the thumbnails already show the result.
      client
        .refetchQueries({ include: [PlaceReviewsDocument] })
        .then((results) => {
          // Without a Place reviews query on the page, the caller's count never changed.
          if (results.length) setSavedAndRefetched((count) => Math.max(count, savedSoFar));
        })
        .catch((error: unknown) => {
          console.error('Error refetching reviews after photos:', error);
        });
    } finally {
      setIsBatchRunning(false);
    }
  };

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Lets the same file be picked again.
    e.target.value = '';
    void uploadPicked(files);
  };

  return { inputRef, photos, room, roomNotice, savedCount, isBusy, openPicker, handlePick };
};
