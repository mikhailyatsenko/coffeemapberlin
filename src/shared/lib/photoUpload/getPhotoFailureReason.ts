import { ApolloError } from '@apollo/client';
import { getSaveErrorReason } from 'shared/lib/saveError';
import { type PhotoFailureReason } from './types';

const REASON_BY_CODE: Record<string, PhotoFailureReason> = {
  RATE_LIMITED: 'rate_limited',
  IMAGE_LIMIT_REACHED: 'limit_reached',
  // The server's only BAD_USER_INPUT for a Photo is an empty or too large file.
  BAD_USER_INPUT: 'unreadable',
};

/** Why an `uploadReviewImage` call failed. */
export const getPhotoFailureReason = (error: unknown): PhotoFailureReason => {
  if (error instanceof ApolloError) {
    const code = error.graphQLErrors[0]?.extensions?.code;
    if (typeof code === 'string' && code in REASON_BY_CODE) return REASON_BY_CODE[code];
  }
  return getSaveErrorReason(error);
};
