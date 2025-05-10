import { client } from 'shared/config/apolloClient';
import { CurrentUserDocument, LogoutDocument } from 'shared/generated/graphql';
import { type User } from 'shared/types';

import { INITIAL_STATE } from '../constants';
import { useAuthStore } from '../hooks';

export const clearAuth = async () => {
  await client.mutate({ mutation: LogoutDocument });
  await client.resetStore();
  useAuthStore.setState(INITIAL_STATE);
};

export const checkAuth = async () => {
  try {
    const { data } = await client.query<{ currentUser: User | null }>({
      query: CurrentUserDocument,
      fetchPolicy: 'network-only',
    });

    useAuthStore.setState({ user: data.currentUser });
  } catch (error) {
    useAuthStore.setState(INITIAL_STATE);
  }
};

export const setUser = (user: User | null) => {
  useAuthStore.setState({ user });
};
