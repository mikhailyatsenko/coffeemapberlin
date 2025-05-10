import { useWithGoogle } from 'features/ContinueWithGoogle';
import { SignInWithEmail } from 'features/SignInWithEmail';
import { SignUpWithEmail } from 'features/SignUpWithEmail';
import { useAuth } from 'shared/api';
import { AuthModalContentVariant } from 'shared/constants';
import { useAuthModal } from 'shared/context/Auth/AuthModalContext';
import { GOOGLE_LOGIN_BUTTON_KEY, GoogleLoginButton } from 'shared/ui/GoogleLoginButton';
import { Loader } from 'shared/ui/Loader';
import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import { LoginRequired } from '../components/LoginRequired';
import { SuccessfulSignUp } from '../components/SuccessfulSignUp';
import cls from './AuthModal.module.scss';

export const AuthModal = () => {
  const { isLoading } = useAuth();
  const continueWithGoogle = useWithGoogle();
  const { authModalContentVariant, showSuccessfulSignUp, showSignIn, showSignUp, hideModal } = useAuthModal();

  if (isLoading) {
    return <Loader />;
  }

  if (authModalContentVariant === AuthModalContentVariant.Hidden) {
    return null;
  }

  return (
    <PortalToBody>
      <Modal onClose={hideModal}>
        <div className={cls.authModalContent}>
          {authModalContentVariant === AuthModalContentVariant.LoginRequired && (
            <LoginRequired onSwitchToSignUp={showSignUp} onSwitchToSignIn={showSignIn} />
          )}
          {authModalContentVariant === AuthModalContentVariant.SignUpWithEmail && (
            <SignUpWithEmail
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
              continueWithSocial={[<GoogleLoginButton key={GOOGLE_LOGIN_BUTTON_KEY} onClick={continueWithGoogle} />]}
              hideAuthModal={hideModal}
              onSwitchToSignUp={showSignUp}
            />
          )}
        </div>
      </Modal>
    </PortalToBody>
  );
};
