import { client } from 'shared/config/apolloClient';
import {
  ClaimGuestReviewsDocument,
  type ClaimGuestReviewsMutation,
  CreateGuestIdentityDocument,
  type CreateGuestIdentityMutation,
} from 'shared/generated/graphql';
import { executeRecaptcha } from 'shared/lib/recaptcha';

/**
 * Guest identity: the credential that lets an unauthenticated visitor leave a
 * review. It is issued once, after a captcha check, and then replaces the
 * captcha for every later guest action.
 *
 * The pair lives in localStorage, so clearing site data loses the reviews for
 * good — that is the trade for not asking a guest to register.
 */

const GUEST_ID_KEY = '3welle:guestId';
const GUEST_SECRET_KEY = '3welle:guestSecret';

export interface GuestIdentity {
  guestId: string;
  guestSecret: string;
}

const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch {
    // Private mode and blocked site data both throw on access.
    return null;
  }
};

const writeStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Nothing to do: the guest simply gets a new identity next time.
  }
};

export const readGuestIdentity = (): GuestIdentity | null => {
  const guestId = readStorage(GUEST_ID_KEY);
  const guestSecret = readStorage(GUEST_SECRET_KEY);

  return guestId && guestSecret ? { guestId, guestSecret } : null;
};

export const clearGuestIdentity = (): void => {
  try {
    localStorage.removeItem(GUEST_ID_KEY);
    localStorage.removeItem(GUEST_SECRET_KEY);
  } catch {
    // Ignore: an identity we cannot clear is one we also cannot read.
  }
};

let pendingIdentity: Promise<GuestIdentity> | null = null;

/**
 * Returns the stored identity, or mints a new one — passing a captcha first.
 * Concurrent callers share one request so a form does not burn several tokens.
 */
export const ensureGuestIdentity = async (): Promise<GuestIdentity> => {
  const existing = readGuestIdentity();
  if (existing) return existing;

  if (pendingIdentity) return await pendingIdentity;

  pendingIdentity = (async () => {
    const captchaToken = await executeRecaptcha('create_guest_identity');

    const { data } = await client.mutate<CreateGuestIdentityMutation>({
      mutation: CreateGuestIdentityDocument,
      variables: { captchaToken },
    });

    const identity = data?.createGuestIdentity;
    if (!identity) {
      throw new Error('Could not start a guest session');
    }

    writeStorage(GUEST_ID_KEY, identity.guestId);
    writeStorage(GUEST_SECRET_KEY, identity.guestSecret);

    return { guestId: identity.guestId, guestSecret: identity.guestSecret };
  })();

  try {
    return await pendingIdentity;
  } finally {
    pendingIdentity = null;
  }
};

/**
 * Attaches reviews left as a guest to the account that just signed in.
 *
 * Credentials are cleared only after a successful response — dropping them on a
 * failed request would strand the reviews permanently.
 *
 * @returns the number of reviews left behind because the account had already
 *   reviewed those places, or null when there was nothing to claim.
 */
export const claimGuestReviews = async (): Promise<number | null> => {
  const identity = readGuestIdentity();
  if (!identity) return null;

  try {
    const { data } = await client.mutate<ClaimGuestReviewsMutation>({
      mutation: ClaimGuestReviewsDocument,
      variables: identity,
    });

    clearGuestIdentity();

    return data?.claimGuestReviews.conflictedCount ?? 0;
  } catch (error) {
    console.error('Failed to claim guest reviews:', error);
    return null;
  }
};
