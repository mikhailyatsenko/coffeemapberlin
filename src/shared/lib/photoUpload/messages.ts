import { SAVE_ERROR_MESSAGES } from 'shared/lib/saveError';
import { MAX_PHOTOS_PER_REVIEW } from './constants';
import { type PhotoFailureReason } from './types';

export const PHOTO_FAILURE_MESSAGES: Record<PhotoFailureReason, string> = {
  ...SAVE_ERROR_MESSAGES,
  rate_limited: 'Too many photos for now, try again later',
  limit_reached: `This review already has ${MAX_PHOTOS_PER_REVIEW} photos`,
  unreadable: "This photo couldn't be read, try a JPEG or PNG",
};
