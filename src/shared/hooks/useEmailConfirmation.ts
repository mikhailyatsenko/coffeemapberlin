import { type ApolloError } from '@apollo/client';
import { useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
// no navigation from this hook
import { client } from 'shared/config/apolloClient';
import { type ConfirmEmailMutation, useConfirmEmailMutation } from 'shared/generated/graphql';
import { checkAuth, useAuthStore } from 'shared/stores/auth';
import { showResendConfirmationEmail, showSuccessfulSignUp } from 'shared/stores/modal';
import { revalidatePlaces } from 'shared/stores/places';

export const useEmailConfirmation = (
  email?: string | null,
  token?: string | null,
  onConfirmationComplete?: () => void,
) => {
  const { isAuthLoading } = useAuthStore();
  const hasProcessedRef = useRef(false);

  const onCompleted = useCallback(
    (data: ConfirmEmailMutation) => {
      void (async () => {
        try {
          await checkAuth();
          await client.resetStore();
          revalidatePlaces();
          if (data.confirmEmail.emailChanged) {
            toast.success('Email changed successfully', { position: 'top-center' });
          } else {
            showSuccessfulSignUp();
          }
          // Call the callback after everything is complete
          onConfirmationComplete?.();
        } catch (error) {
          // Still call callback even on error to allow navigation
          onConfirmationComplete?.();
        }
      })();
    },
    [onConfirmationComplete],
  );

  const onError = useCallback(
    (error: ApolloError) => {
      const alreadyConfirmedError = error.graphQLErrors.find((e) => e.extensions?.code === 'EMAIL_ALREADY_CONFIRMED');
      if (alreadyConfirmedError) {
        toast.error('Email is already confirmed', { position: 'top-center' });
        onConfirmationComplete?.();
        return;
      }
      const tokenExpired = error.graphQLErrors.some((e) => e.extensions?.code === 'TOKEN_EXPIRED');
      showResendConfirmationEmail(tokenExpired);
      onConfirmationComplete?.();
    },
    [onConfirmationComplete],
  );

  const [confirmEmailMutation] = useConfirmEmailMutation({
    onCompleted,
    onError,
  });

  useEffect(() => {
    // Only process if we have both token and email, not loading, and haven't processed yet
    if (token && email && !isAuthLoading && !hasProcessedRef.current) {
      hasProcessedRef.current = true;

      // TODO: think about possibility show toast below only for new registered users,
      // skipping users that just changed email
      // if (user) {
      //   toast.error('Please log out before verifying email', { position: 'top-center' });
      // } else {
      void confirmEmailMutation({ variables: { token, email } });
      // }
    }
  }, [token, email, isAuthLoading, confirmEmailMutation]);
};
