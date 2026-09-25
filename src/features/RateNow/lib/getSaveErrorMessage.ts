import { getSaveErrorReason, type SaveErrorReason } from './getSaveErrorReason';

const MESSAGES: Record<SaveErrorReason, string> = {
  recaptcha:
    "We couldn't verify you: reCAPTCHA was blocked, possibly by an ad blocker. Allow it for this site or sign in, then try again.",
  network: "We couldn't save that. Please check your connection and try again.",
};

/** A short message for a Rating or Characteristic that failed to save. */
export const getSaveErrorMessage = (error: unknown): string => MESSAGES[getSaveErrorReason(error)];
