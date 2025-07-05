import { type ApolloError } from '@apollo/client';
import { useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { useConfirmEmailMutation } from 'shared/generated/graphql';
import { checkAuth, useAuthStore } from 'shared/stores/auth';
import { showResendConfirmationEmail, showSuccessfulSignUp } from 'shared/stores/modal';

export const useEmailConfirmation = (email?: string | null, token?: string | null) => {
  const { user, isAuthLoading } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const onCompleted = useCallback(() => {
    checkAuth();
    showSuccessfulSignUp();
    navigate(RoutePaths.main, { replace: true, state: {} });
  }, [navigate]);

  const onError = useCallback(
    (error: ApolloError) => {
      const alreadyConfirmedError = error.graphQLErrors.find((e) => e.extensions?.code === 'EMAIL_ALREADY_CONFIRMED');
      if (alreadyConfirmedError) {
        toast('Email is already confirmed');
        navigate(RoutePaths.main, { replace: true, state: {} });
        return;
      }
      const tokenExpired = error.graphQLErrors.some((e) => e.extensions?.code === 'TOKEN_EXPIRED');
      if (!user) {
        showResendConfirmationEmail(tokenExpired);
      }
    },
    [user, navigate],
  );

  const [confirmEmailMutation] = useConfirmEmailMutation({
    onCompleted,
    onError,
  });

  useEffect(() => {
    if (matchPath(RoutePaths.confirmEmail, location.pathname) && (!email || !token)) {
      navigate(RoutePaths.main, { replace: true, state: {} });
    }

    if (token && email && !isAuthLoading) {
      if (!matchPath(RoutePaths.confirmEmail, location.pathname)) {
        navigate(RoutePaths.main, { replace: true, state: {} });
      }

      if (user) {
        toast('Please log out before verifying email');
        navigate(RoutePaths.main, { replace: true, state: {} });
      } else {
        confirmEmailMutation({ variables: { token, email } });
      }
    }

    // eslint-disable-next-line
  }, [token, email, user, isAuthLoading, confirmEmailMutation, navigate, location.pathname]);
};
