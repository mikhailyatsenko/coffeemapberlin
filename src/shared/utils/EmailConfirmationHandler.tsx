import { type ApolloError } from '@apollo/client';
import { useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useConfirmEmailMutation } from 'shared/generated/graphql';
import { checkAuth } from 'shared/stores/auth';
import { showResendConfirmationEmail, showSuccessfulSignUp } from 'shared/stores/modal';
import Toast from 'shared/ui/ToastMessage/Toast';

export const EmailConfirmationHandler = () => {
  const location = useLocation();
  const { token, email } = (location.state || {}) as { token?: string; email?: string };
  const [toastMessage, setToastMessage] = useState('');

  const onCompleted = useCallback(() => {
    checkAuth();
    showSuccessfulSignUp();
  }, []);

  const onError = useCallback((error: ApolloError) => {
    const alreadyConfirmedError = error.graphQLErrors.find((e) => e.extensions?.code === 'EMAIL_ALREADY_CONFIRMED');
    if (alreadyConfirmedError) {
      setToastMessage('Email is already confirmed');
      return;
    }
    const tokenExpired = error.graphQLErrors.some((e) => e.extensions?.code === 'TOKEN_EXPIRED');
    showResendConfirmationEmail(tokenExpired);
  }, []);

  const [confirmEmailMutation] = useConfirmEmailMutation({
    onCompleted,
    onError,
  });

  useEffect(() => {
    if (typeof token === 'string' && typeof email === 'string') {
      confirmEmailMutation({ variables: { token, email } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email]);

  if (!toastMessage) return null;

  return <Toast message={toastMessage} />;
};
