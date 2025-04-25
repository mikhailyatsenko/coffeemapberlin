import { useAuth } from 'shared/api';
import { AuthModalContentVariant } from 'shared/constants';
import { useAuthModal } from 'shared/context/Auth/AuthModalContext';
import { Loader } from 'shared/ui/Loader';
import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import { LoginRequired } from '../components/LoginRequired';
import { SignInWithEmail } from '../components/SignInWithEmail';
import { SignUpWithEmail } from '../components/SignUpWithEmail';
import { SuccessfulSignUp } from '../components/SuccessfulSignUp';
import cls from './AuthModal.module.scss';

export const AuthModal = () => {
  const { isLoading } = useAuth();
  const { authModalContentVariant, showSuccessfulSignUp, showSignIn, showSignUp, hideModal } = useAuthModal();

  if (isLoading) {
    return <Loader />;
  }
  console.log(authModalContentVariant);

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
            <SignUpWithEmail onSuccessfulSignUp={showSuccessfulSignUp} onSwitchToSignIn={showSignIn} />
          )}
          {authModalContentVariant === AuthModalContentVariant.SuccessfulSignUp && (
            <SuccessfulSignUp hideAuthModal={hideModal} />
          )}
          {authModalContentVariant === AuthModalContentVariant.SignInWithEmail && (
            <SignInWithEmail hideAuthModal={hideModal} onSwitchToSignUp={showSignUp} />
          )}
        </div>
      </Modal>
    </PortalToBody>
  );
};
