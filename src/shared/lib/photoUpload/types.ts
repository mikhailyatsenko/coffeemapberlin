import { type SaveErrorReason } from 'shared/lib/saveError';

/** Why a Photo failed, as sent with `contribution_failed`. */
export type PhotoFailureReason = SaveErrorReason | 'rate_limited' | 'limit_reached' | 'in_progress' | 'unreadable';

/**
 * - `pending`: downscaled and waiting to upload;
 * - `uploading`: its `uploadReviewImage` is in flight;
 * - `saved`: attached to the Review, never rolled back;
 * - `failed`: see `reason`; an `unreadable` one is never sent.
 */
export type PhotoStatus = 'pending' | 'uploading' | 'saved' | 'failed';

/** One picked file on its way to a Review. */
export interface Photo {
  id: string;
  name: string;
  /** The downscaled file; missing when the picked file couldn't be read. */
  file?: File;
  /** An object URL for the thumbnail. */
  localUrl: string;
  status: PhotoStatus;
  reason?: PhotoFailureReason;
}

/** Whether a Photo can reach the Review: an unreadable one never does, so it takes no room. */
export const isUploadable = (photo: Photo) => photo.reason !== 'unreadable';
