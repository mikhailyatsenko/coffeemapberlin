import { RecaptchaUnavailableError } from 'shared/lib/recaptcha';

/** A short message for a Rating or Characteristic that failed to save. */
export const getSaveErrorMessage = (error: unknown): string =>
  error instanceof RecaptchaUnavailableError
    ? "We couldn't verify you: reCAPTCHA was blocked, possibly by an ad blocker. Allow it for this site or sign in, then try again."
    : "We couldn't save that. Please check your connection and try again.";
