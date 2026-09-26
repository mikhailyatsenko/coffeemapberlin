import { useApolloClient } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { PlaceReviewsDocument } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { contributionCredentials } from 'shared/lib/guest';
import { type PhotoFailureReason, usePhotoUpload } from 'shared/lib/photoUpload';
import { getSaveErrorReason } from 'shared/lib/saveError';
import { useAuthStore } from 'shared/stores/auth';

import { getActor } from '../../../lib/getActor';
import { trackContributionFailed } from '../../../lib/trackContributionFailed';
import { type AddPhotosProps } from '../types';

/**
 * Uploads the picked Photos to the Review straight away, one batch per pick, and
 * refetches the Place reviews once a batch saves so the own Review card shows them.
 * A failed Photo keeps its reason and can be sent again on its own.
 */
export const useAddPhotos = ({ placeId, reviewId, reviewPhotoCount, hasReviewText }: AddPhotosProps) => {
  const client = useApolloClient();
  const user = useAuthStore((s) => s.user);
  const inputRef = useRef<HTMLInputElement | null>(null);
  // Photos saved here that the caller's count already includes, known once the refetch after their batch lands.
  // The upload counts every Photo saved here, so the Review's other Photos are the caller's count without these.
  const [savedAndRefetched, setSavedAndRefetched] = useState(0);
  const { photos, room, roomNotice, isPreparing, isUploading, add, uploadPhotos, fail } = usePhotoUpload(
    Math.max(0, reviewPhotoCount - savedAndRefetched),
  );
  // From the pick or Retry to the upload settling, including the Guest identity check the upload starts with.
  const [isSending, setIsSending] = useState(false);
  // The latest failure, until an upload saves again.
  const [alertReason, setAlertReason] = useState<PhotoFailureReason | null>(null);
  // Aborted on unmount, so leaving the page stops the upload. Created in the effect to survive StrictMode's remount.
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    return () => {
      controller.abort();
    };
  }, []);

  // Photos saved here across batches; a ref, as a batch reads it after awaiting the upload.
  const savedRef = useRef(0);

  const isBusy = isSending || isPreparing || isUploading;
  const savedCount = photos.filter((photo) => photo.status === 'saved').length;

  const openPicker = () => {
    trackEvent('photo_button_click', { place_id: placeId, actor: getActor(user) });
    inputRef.current?.click();
  };

  const reportFailures = (reasons: PhotoFailureReason[]) => {
    if (!reasons.length) return;
    setAlertReason(reasons[reasons.length - 1]);
    reasons.forEach((reason) => {
      trackContributionFailed(placeId, getActor(user), { kind: 'photo', reason });
    });
  };

  /** Uploads the Photos `ids` under the person's identity, then reports the result. */
  const sendPhotos = async (ids: string[]) => {
    const signal = abortRef.current?.signal;
    if (!reviewId || !ids.length || signal?.aborted) return;

    let guestCredentials;
    try {
      // Reuses the Guest identity the Rating created, so there is no captcha again.
      guestCredentials = await contributionCredentials(!!user);
    } catch (error) {
      if (signal?.aborted) return;
      console.error('Error adding photos:', error);
      const reason = getSaveErrorReason(error);
      fail(ids, reason);
      reportFailures(ids.map(() => reason));
      return;
    }

    // An abort adds no failure; Photos saved before it still count and still refresh the Review.
    const { saved, failures } = await uploadPhotos(ids, { reviewId, guestCredentials, signal });
    reportFailures(failures);
    if (saved === 0) return;
    if (!failures.length) setAlertReason(null);

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
  };

  const whileSending = async (run: () => Promise<void>) => {
    setIsSending(true);
    try {
      await run();
    } finally {
      setIsSending(false);
    }
  };

  const uploadPicked = async (files: File[]) => {
    if (!reviewId || !files.length) return;
    await whileSending(async () => {
      const { added } = await add(files);
      await sendPhotos(added.filter((photo) => photo.status === 'pending').map((photo) => photo.id));
      // After the upload, whose success would otherwise clear the alert these files raise.
      reportFailures(added.flatMap((photo) => (photo.status === 'failed' && photo.reason ? [photo.reason] : [])));
    });
  };

  const retryPhoto = (id: string) => {
    void whileSending(async () => {
      await sendPhotos([id]);
    });
  };

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    // Lets the same file be picked again.
    e.target.value = '';
    void uploadPicked(files);
  };

  return {
    inputRef,
    photos,
    room,
    roomNotice,
    alertReason,
    savedCount,
    isBusy,
    openPicker,
    handlePick,
    retryPhoto,
  };
};
