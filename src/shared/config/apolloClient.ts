import { createHttpLink, ApolloClient, InMemoryCache, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { clearGuestIdentity, readGuestIdentity } from 'shared/lib/guest/guestStorage';

const httpLink = createHttpLink({
  uri: process.env.VITE_ENV === 'development' ? process.env.VITE_API_URL : process.env.VITE_API_URL_PROD,
  credentials: 'include',
});

/**
 * Guest credentials ride on every request, the way the session cookie does.
 *
 * They belong here rather than in each operation's variables: reads need them
 * too — that is how the server knows which rating and which characteristics are
 * the visitor's own — and putting a secret into query arguments would make it
 * part of Apollo's cache keys.
 */
const guestLink = setContext((_, { headers }) => {
  const identity = readGuestIdentity();

  if (!identity) return { headers };

  return {
    headers: {
      ...headers,
      'x-guest-id': identity.guestId,
      'x-guest-secret': identity.guestSecret,
    },
  };
});

/**
 * Credentials the server no longer accepts are worse than none: they make every
 * guest action fail until the storage is cleared by hand. Dropping them lets the
 * next attempt mint a fresh identity.
 */
const guestRecoveryLink = onError(({ graphQLErrors }) => {
  const staleIdentity = graphQLErrors?.some((error) => error.extensions?.code === 'GUEST_IDENTITY_INVALID');

  if (staleIdentity) {
    clearGuestIdentity();
  }
});

export const client = new ApolloClient({
  link: from([guestRecoveryLink, guestLink, httpLink]),
  cache: new InMemoryCache(),
});
