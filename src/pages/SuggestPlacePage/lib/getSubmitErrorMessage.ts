import { ApolloError } from '@apollo/client';
import { RecaptchaUnavailableError } from 'shared/lib/recaptcha';
import { SAVE_ERROR_MESSAGES } from 'shared/lib/saveError';

const RATE_LIMIT_MESSAGE = "You've reached today's limit for suggestions. Please try again tomorrow.";
const GENERIC_MESSAGE = "We couldn't send your suggestion. Please try again.";

/** What to tell the person when their suggestion wasn't sent. */
export const getSubmitErrorMessage = (error: unknown): string => {
  if (error instanceof ApolloError && error.graphQLErrors[0]?.extensions?.code === 'RATE_LIMITED') {
    return RATE_LIMIT_MESSAGE;
  }
  // A blocked reCAPTCHA needs the person to act, so it keeps its own message.
  if (error instanceof RecaptchaUnavailableError) return SAVE_ERROR_MESSAGES.recaptcha;
  return GENERIC_MESSAGE;
};
