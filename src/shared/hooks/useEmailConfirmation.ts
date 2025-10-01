import { type ApolloError } from '@apollo/client';
import { useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
// no navigation from this hook
import { useConfirmEmailMutation } from 'shared/generated/graphql';
import { checkAuth, useAuthStore } from 'shared/stores/auth';
import { showResendConfirmationEmail, showSuccessfulSignUp } from 'shared/stores/modal';

export const useEmailConfirmation = (email?: string | null, token?: string | null) => {
  const { user, isAuthLoading } = useAuthStore();
  const hasProcessedRef = useRef(false);

  const onCompleted = useCallback(() => {
    void checkAuth();
    showSuccessfulSignUp();
  }, []);

  const onError = useCallback(
    (error: ApolloError) => {
      const alreadyConfirmedError = error.graphQLErrors.find((e) => e.extensions?.code === 'EMAIL_ALREADY_CONFIRMED');
      if (alreadyConfirmedError) {
        toast('Email is already confirmed');
        return;
      }
      const tokenExpired = error.graphQLErrors.some((e) => e.extensions?.code === 'TOKEN_EXPIRED');
      if (!user) {
        console.log('tokenExpired', tokenExpired);
        showResendConfirmationEmail(tokenExpired);
      }
    },
    [user],
  );

  const [confirmEmailMutation] = useConfirmEmailMutation({
    onCompleted,
    onError,
  });

  useEffect(() => {
    // Only process if we have both token and email, not loading, and haven't processed yet
    if (token && email && !isAuthLoading && !hasProcessedRef.current) {
      hasProcessedRef.current = true;

      if (user) {
        toast('Please log out before verifying email');
      } else {
        confirmEmailMutation({ variables: { token, email } });
      }
    }
  }, [token, email, user, isAuthLoading, confirmEmailMutation]);
};
