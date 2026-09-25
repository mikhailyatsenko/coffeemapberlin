import { useApolloClient } from '@apollo/client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { UploadReviewImageDocument, type UploadReviewImageMutation } from 'shared/generated/graphql';
import { type GuestIdentity } from 'shared/lib/guest';
import { MAX_PHOTOS_PER_REVIEW } from './constants';
import { fileToBase64 } from './fileToBase64';
import { getPhotoFailureReason } from './getPhotoFailureReason';
import { preparePhoto } from './preparePhoto';
import { isUploadable, type Photo, type PhotoFailureReason } from './types';

/**
 * Uploads Review Photos through our own server, one mutation per file.
 *
 * ImageKit's browser upload signature covers only token+expire, so a folder can
 * never be pinned down client-side; sending the bytes to our server is the only
 * way the path and the file names stay ours. The server also owns the image
 * counter, so a run that stops halfway leaves a Review with fewer Photos rather
 * than a Review whose counter points at files that were never uploaded.
 */

export interface UploadTarget {
  reviewId: string;
  guestCredentials: Partial<GuestIdentity>;
  signal?: AbortSignal;
}

export interface UploadResult {
  saved: number;
  /** One reason per Photo that failed in this run. */
  failures: PhotoFailureReason[];
  aborted: boolean;
}

/**
 * The Photos a person picked for one Review, and their upload.
 * @param existingCount Photos the Review already has; they count against its limit.
 */
export const usePhotoUpload = (existingCount: number) => {
  const client = useApolloClient();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [roomNotice, setRoomNotice] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  // Files kept by a pick but still downscaling; they already take room.
  const [preparingCount, setPreparingCount] = useState(0);
  // The upload loop runs across renders and must see Photos added or updated since it started.
  const photosRef = useRef(photos);
  photosRef.current = photos;

  const room = Math.max(0, MAX_PHOTOS_PER_REVIEW - existingCount - preparingCount - photos.filter(isUploadable).length);
  const isPreparing = preparingCount > 0;

  const update = (id: string, patch: Partial<Photo>) => {
    setPhotos((prev) => prev.map((photo) => (photo.id === id ? { ...photo, ...patch } : photo)));
  };

  /** Keeps as many files as the Review has room for, downscales them and returns how many it dropped. */
  const add = async (files: File[]): Promise<{ dropped: number }> => {
    const kept = files.slice(0, room);
    const dropped = files.length - kept.length;
    setRoomNotice(dropped > 0 ? `You can add ${kept.length} more` : null);

    setPreparingCount((count) => count + kept.length);
    const prepared = await Promise.all(kept.map(preparePhoto));
    // Ahead of the render, so an upload started right after `add` sees them.
    photosRef.current = [...photosRef.current, ...prepared];
    setPhotos((prev) => [...prev, ...prepared]);
    setPreparingCount((count) => count - kept.length);

    return { dropped };
  };

  /** Removes a Photo that hasn't been uploaded. */
  const remove = (id: string) => {
    const photo = photosRef.current.find((p) => p.id === id);
    if (photo) URL.revokeObjectURL(photo.localUrl);
    setPhotos((prev) => prev.filter((p) => p.id !== id));
    setRoomNotice(null);
  };

  const removeAll = () => {
    photosRef.current.forEach((photo) => {
      URL.revokeObjectURL(photo.localUrl);
    });
    setPhotos([]);
    setRoomNotice(null);
  };

  // Sequential on purpose: the server assigns image_1, image_2, ... in the order it accepts them.
  const uploadEach = useCallback(
    async (ids: string[], { reviewId, guestCredentials, signal }: UploadTarget): Promise<UploadResult> => {
      const result: UploadResult = { saved: 0, failures: [], aborted: false };
      setIsUploading(true);

      for (const id of ids) {
        const file = photosRef.current.find((photo) => photo.id === id)?.file;
        if (!file) continue;

        if (signal?.aborted) {
          result.aborted = true;
          break;
        }

        update(id, { status: 'uploading', reason: undefined });

        try {
          await client.mutate<UploadReviewImageMutation>({
            mutation: UploadReviewImageDocument,
            variables: { reviewId, fileBuffer: await fileToBase64(file), ...guestCredentials },
            context: { fetchOptions: { signal } },
          });
          update(id, { status: 'saved' });
          result.saved += 1;
        } catch (error) {
          if (signal?.aborted) {
            // Aborts come only from leaving the upload (a cancelled submit closes the form), so this
            // Photo is never sent again, even though the server may have saved it before the abort landed.
            update(id, { status: 'pending' });
            result.aborted = true;
            break;
          }

          const reason = getPhotoFailureReason(error);
          update(id, { status: 'failed', reason });
          result.failures.push(reason);
        }
      }

      setIsUploading(false);
      return result;
    },
    [client],
  );

  /** Uploads every Photo waiting to upload. Saved Photos stay saved whatever happens to the rest. */
  const upload = async (target: UploadTarget) =>
    await uploadEach(
      photosRef.current.filter((photo) => photo.status === 'pending').map((photo) => photo.id),
      target,
    );

  /** Fails every Photo waiting to upload, when the upload can't start at all. */
  const failWaiting = (reason: PhotoFailureReason) => {
    setPhotos((prev) =>
      prev.map((photo) => (photo.status === 'pending' ? { ...photo, status: 'failed', reason } : photo)),
    );
  };

  /** Uploads one failed Photo again. */
  const retry = async (id: string, target: UploadTarget) => await uploadEach([id], target);

  useEffect(
    () => () => {
      photosRef.current.forEach((photo) => {
        URL.revokeObjectURL(photo.localUrl);
      });
    },
    [],
  );

  return { photos, room, roomNotice, isPreparing, isUploading, add, remove, removeAll, upload, retry, failWaiting };
};

export type PhotoUpload = ReturnType<typeof usePhotoUpload>;
