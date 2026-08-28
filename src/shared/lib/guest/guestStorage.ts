/**
 * Where a guest's credentials live between visits.
 *
 * Kept free of imports on purpose: the Apollo link reads it while building every
 * request, and the module that mints identities talks to Apollo. Anything shared
 * between the two has to sit below both.
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

export const readGuestIdentity = (): GuestIdentity | null => {
  const guestId = readStorage(GUEST_ID_KEY);
  const guestSecret = readStorage(GUEST_SECRET_KEY);

  return guestId && guestSecret ? { guestId, guestSecret } : null;
};

export const writeGuestIdentity = ({ guestId, guestSecret }: GuestIdentity): void => {
  try {
    localStorage.setItem(GUEST_ID_KEY, guestId);
    localStorage.setItem(GUEST_SECRET_KEY, guestSecret);
  } catch {
    // Nothing to do: the guest simply gets a new identity next time.
  }
};

export const clearGuestIdentity = (): void => {
  try {
    localStorage.removeItem(GUEST_ID_KEY);
    localStorage.removeItem(GUEST_SECRET_KEY);
  } catch {
    // Ignore: an identity we cannot clear is one we also cannot read.
  }
};
