import { client } from 'shared/config/apolloClient';
import { CurrentUserDocument, LogoutDocument } from 'shared/generated/graphql';
// import { revalidatePlaces } from 'shared/stores/places';
import { type User } from 'shared/types';

import { INITIAL_STATE } from '../constants';
import { useAuthStore } from '../hooks';

export const clearAuth = async () => {
  useAuthStore.setState({ ...INITIAL_STATE, isAuthLoading: false });
  await client.mutate({ mutation: LogoutDocument });
  await client.resetStore();
  // revalidatePlaces();
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
