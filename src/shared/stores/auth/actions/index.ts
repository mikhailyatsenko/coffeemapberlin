import toast from 'react-hot-toast';
import { client } from 'shared/config/apolloClient';
import { CurrentUserDocument, LogoutDocument } from 'shared/generated/graphql';
import { claimGuestReviews } from 'shared/lib/guest';
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

    if (data.currentUser) {
      void claimReviewsLeftAsGuest();
    }
  } catch (error) {
    useAuthStore.setState({ ...INITIAL_STATE, isAuthLoading: false });
  }
};

export const setUser = (user: User | null) => {
  useAuthStore.setState((state) => ({ ...state, user, isAuthLoading: false }));

  if (user) {
    void claimReviewsLeftAsGuest();
  }
};

/**
 * Runs after any successful sign-in. Does nothing — and makes no request — when
 * this browser never left a guest review.
 */
const claimReviewsLeftAsGuest = async () => {
  const conflictedCount = await claimGuestReviews();

  if (conflictedCount) {
    // The account already had a review for those places, so the guest ones were
    // left alone rather than overwriting anything.
    toast(`${conflictedCount} guest review(s) could not be added to your account`);
  }
};
