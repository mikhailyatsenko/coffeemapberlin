import { RecaptchaUnavailableError } from 'shared/lib/recaptcha';

export type SaveErrorReason = 'recaptcha' | 'network';

/** Why a contribution failed, as sent with `contribution_failed`. */
export const getSaveErrorReason = (error: unknown): SaveErrorReason =>
  error instanceof RecaptchaUnavailableError ? 'recaptcha' : 'network';
