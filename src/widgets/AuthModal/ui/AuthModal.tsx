import { useEffect, useState } from 'react';
import { useWithGoogle } from 'features/ContinueWithGoogle';
import { SignInWithEmail } from 'features/SignInWithEmail';
import { SignUpWithEmail } from 'features/SignUpWithEmail';
import { AuthModalContentVariant } from 'shared/constants';
import { useAuthModal } from 'shared/context/Auth/AuthModalContext';
import { GOOGLE_LOGIN_BUTTON_KEY, GoogleLoginButton } from 'shared/ui/GoogleLoginButton';
import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import { LoginRequired } from '../components/LoginRequired';
import { SuccessfulSignUp } from '../components/SuccessfulSignUp';
import cls from './AuthModal.module.scss';

export const AuthModal = () => {
  const [error, setError] = useState<Error | null>(null);
  const continueWithGoogle = useWithGoogle({ setError });
  const { authModalContentVariant, showSuccessfulSignUp, showSignIn, showSignUp, hideModal } = useAuthModal();

  useEffect(() => {
    setError(null);
  }, [authModalContentVariant]);

  if (authModalContentVariant === AuthModalContentVariant.Hidden) {
    return null;
  }

  return (
    <PortalToBody>
      <Modal onClose={hideModal}>
        <div className={cls.authModalContent}>
          {authModalContentVariant === AuthModalContentVariant.LoginRequired && (
            <LoginRequired setError={setError} onSwitchToSignUp={showSignUp} onSwitchToSignIn={showSignIn} />
          )}
          {authModalContentVariant === AuthModalContentVariant.SignUpWithEmail && (
            <SignUpWithEmail
              setError={setError}
              continueWithSocial={[<GoogleLoginButton key={GOOGLE_LOGIN_BUTTON_KEY} onClick={continueWithGoogle} />]}
              onSuccessfulSignUp={showSuccessfulSignUp}
              onSwitchToSignIn={showSignIn}
            />
          )}
          {authModalContentVariant === AuthModalContentVariant.SuccessfulSignUp && (
            <SuccessfulSignUp hideAuthModal={hideModal} />
          )}
          {authModalContentVariant === AuthModalContentVariant.SignInWithEmail && (
            <SignInWithEmail
              setError={setError}
              continueWithSocial={[<GoogleLoginButton key={GOOGLE_LOGIN_BUTTON_KEY} onClick={continueWithGoogle} />]}
              hideAuthModal={hideModal}
              onSwitchToSignUp={showSignUp}
            />
          )}
          <p className={cls.errorMessage}>{error?.message}</p>
        </div>
      </Modal>
    </PortalToBody>
  );
};
