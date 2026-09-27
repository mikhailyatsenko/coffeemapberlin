import { ApolloError } from '@apollo/client';

const errorCode = (error: unknown): unknown =>
  error instanceof ApolloError ? error.graphQLErrors[0]?.extensions?.code : undefined;

/** The token doesn't match the suggestion, or the suggestion doesn't exist (ADR 0002). */
export const isInvalidLinkError = (error: unknown): boolean => errorCode(error) === 'INVALID_REVIEW_LINK';

export const isDuplicateGooglePlaceIdError = (error: unknown): boolean =>
  errorCode(error) === 'DUPLICATE_GOOGLE_PLACE_ID';

const OBJECT_ID = /[0-9a-f]{24}/g;

/**
 * The existing Place's id from a duplicate Google Place ID error. The server can
 * only pass it in the message, as its last 24-hex-char word.
 */
export const existingPlaceIdOf = (error: unknown): string | null => {
  if (!(error instanceof ApolloError)) return null;
  const ids = error.graphQLErrors[0]?.message.match(OBJECT_ID);
  return ids ? ids[ids.length - 1] : null;
};
