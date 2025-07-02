import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useConfirmEmailMutation } from 'shared/generated/graphql';
import { checkAuth } from 'shared/stores/auth';
import { showSuccessfulSignUp } from 'shared/stores/modal';
import Toast from 'shared/ui/ToastMessage/Toast';

export const EmailConfirmationHandler = () => {
  const location = useLocation();
  const { token, email } = (location.state || {}) as { token?: string; email?: string };
  const [confirmEmailMutation] = useConfirmEmailMutation();
  const [toastMessage, setToastMessage] = useState('');
  const [handled, setHandled] = useState(false);

  useEffect(() => {
    const confirmEmail = async () => {
      if (typeof token === 'string' && typeof email === 'string' && !handled) {
        try {
          await confirmEmailMutation({ variables: { token, email } });
          checkAuth();
          showSuccessfulSignUp();
        } catch (error: unknown) {
          setToastMessage(error instanceof Error ? error.message : 'An unknown error occurred');
        }
        setHandled(true);
      }
    };

    confirmEmail();
  }, [token, email, handled, confirmEmailMutation]);

  if (!toastMessage) return null;

  return <Toast message={toastMessage} />;
};
