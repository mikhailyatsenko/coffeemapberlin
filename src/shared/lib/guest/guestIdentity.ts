import { client } from 'shared/config/apolloClient';
import {
  ClaimGuestReviewsDocument,
  type ClaimGuestReviewsMutation,
  CreateGuestIdentityDocument,
  type CreateGuestIdentityMutation,
} from 'shared/generated/graphql';
import { executeRecaptcha } from 'shared/lib/recaptcha';
import { clearGuestIdentity, type GuestIdentity, readGuestIdentity, writeGuestIdentity } from './guestStorage';

/**
 * Guest identity: the credential that lets an unauthenticated visitor leave a
 * review. It is issued once, after a captcha check, and then replaces the
 * captcha for every later guest action.
 *
 * The pair lives in localStorage. The review itself is public either way — what
 * is lost with the storage is the proof that it belongs to this visitor, and
 * with it the ability to edit the review or claim it under an account.
 */

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

    const minted = { guestId: identity.guestId, guestSecret: identity.guestSecret };
    writeGuestIdentity(minted);

    return minted;
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
