import { useState } from 'react';
import { useDeletePlaceSuggestionPhotoMutation } from 'shared/generated/graphql';
import { usePhotoUpload } from 'shared/lib/photoUpload';
import { type ReviewLink } from '../types';

/**
 * The suggestion's photos on the review page: the stored ones (`paths`, the card image first) and the admin's
 * own on their way up. A picked photo uploads at once and joins the end of `paths` once stored; Delete erases a
 * stored photo on the server and takes it out once the server confirms.
 * @param updatePaths changes the stored photos from their latest value
 */
export const useReviewPhotos = (
  { id, token }: ReviewLink,
  paths: string[],
  updatePaths: (change: (paths: string[]) => string[]) => void,
) => {
  const upload = usePhotoUpload(paths.length);
  const { photos, room, isPreparing, add, remove, uploadPhotos } = upload;
  const [deletePhoto] = useDeletePlaceSuggestionPhotoMutation();
  // Set after a pick that didn't fit, until the next pick. Not the upload's own notice: `remove`, which every
  // stored photo goes through, clears that one.
  const [roomNotice, setRoomNotice] = useState<string | null>(null);
  const [deletingPath, setDeletingPath] = useState<string | null>(null);
  const [deleteFailed, setDeleteFailed] = useState(false);

  /** Uploads one photo; once stored, it leaves the uploads and joins the stored photos. */
  const uploadOne = async (photoId: string) => {
    const { paths: stored } = await uploadPhotos([photoId], { suggestionId: id, adminToken: token });
    if (!stored.length) return;
    updatePaths((current) => [...current, ...stored]);
    remove(photoId);
  };

  const pick = async (files: File[]) => {
    const { dropped, added } = await add(files);
    setRoomNotice(dropped > 0 ? `Only ${files.length - dropped} more fit; the rest weren't added` : null);
    // One at a time, so a pick's photos are stored in the order they were picked; a Retry or another pick
    // meanwhile runs alongside, which Publish doesn't mind: only the card image's place matters.
    for (const photo of added) {
      if (photo.status === 'pending') await uploadOne(photo.id);
    }
  };

  const retry = (photoId: string) => {
    void uploadOne(photoId);
  };

  const makeCardImage = (path: string) => {
    updatePaths((current) => [path, ...current.filter((other) => other !== path)]);
  };

  const runDelete = async (path: string) => {
    setDeleteFailed(false);
    setDeletingPath(path);
    try {
      await deletePhoto({ variables: { id, token, path } });
      updatePaths((current) => current.filter((other) => other !== path));
    } catch {
      setDeleteFailed(true);
    } finally {
      setDeletingPath(null);
    }
  };

  /** Erases a stored photo; a failed delete keeps it in the list. */
  const deleteStoredPhoto = (path: string) => {
    void runDelete(path);
  };

  const isUploading = isPreparing || photos.some((photo) => photo.status === 'pending' || photo.status === 'uploading');

  return {
    paths,
    /** The admin's photos not stored yet: waiting, uploading or failed. */
    uploads: photos,
    room,
    roomNotice,
    deletingPath,
    deleteFailed,
    pick,
    retry,
    removeUpload: remove,
    makeCardImage,
    deleteStoredPhoto,
    /** Publish waits: a photo is on its way up, or a delete hasn't settled. */
    isBusy: isUploading || deletingPath !== null,
  };
};

export type ReviewPhotos = ReturnType<typeof useReviewPhotos>;
