import { client } from 'shared/config/apolloClient';
import { CurrentUserDocument, LogoutDocument } from 'shared/generated/graphql';
import { type User } from 'shared/types';

import { INITIAL_STATE } from '../constants';
import { useAuthStore } from '../hooks';

export const clearAuth = async () => {
  await client.mutate({ mutation: LogoutDocument });
  await client.resetStore();
  useAuthStore.setState({ ...INITIAL_STATE, isAuthLoading: false });
};

export const checkAuth = async () => {
  useAuthStore.setState((state) => ({ ...state, isAuthLoading: true }));
  try {
    const { data } = await client.query<{ currentUser: User | null }>({
      query: CurrentUserDocument,
      fetchPolicy: 'network-only',
    });

    useAuthStore.setState({ user: data.currentUser, isAuthLoading: false });
  } catch (error) {
    useAuthStore.setState({ ...INITIAL_STATE, isAuthLoading: false });
  }
};

export const setUser = (user: User | null) => {
  useAuthStore.setState((state) => ({ ...state, user, isAuthLoading: false }));
};
