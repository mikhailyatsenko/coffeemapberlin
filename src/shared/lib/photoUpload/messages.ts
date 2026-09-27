import { SAVE_ERROR_MESSAGES } from 'shared/lib/saveError';
import { MAX_PHOTOS } from './constants';
import { type PhotoFailureReason } from './types';

export const PHOTO_FAILURE_MESSAGES: Record<PhotoFailureReason, string> = {
  ...SAVE_ERROR_MESSAGES,
  rate_limited: 'Too many photos for now, try again later',
  limit_reached: `Already ${MAX_PHOTOS} photos, the most allowed`,
  in_progress: 'Another photo is still uploading, try again in a minute',
  unreadable: "This photo couldn't be read, try a JPEG or PNG",
};
