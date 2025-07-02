import { useEffect, useState } from 'react';
import { useWithGoogle } from 'features/ContinueWithGoogle';
import { SignInWithEmail } from 'features/SignInWithEmail';
import { SignUpWithEmail } from 'features/SignUpWithEmail';

import { hideModal, showConfirmEmail, showSignIn, showSignUp, useModalStore } from 'shared/stores/modal';
import { ModalContentVariant } from 'shared/stores/modal/constants';
import { GOOGLE_LOGIN_BUTTON_KEY, GoogleLoginButton } from 'shared/ui/GoogleLoginButton';
import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
import { ConfirmEmail } from '../components/ConfirmEmail';
import { LoginRequired } from '../components/LoginRequired';
import { SuccessfulSignUp } from '../components/SuccessfulSignUp';
import cls from './AuthModal.module.scss';

export const AuthModal = () => {
  const [error, setError] = useState<Error | null>(null);
  const continueWithGoogle = useWithGoogle({ setError });
  const modalContentVariant = useModalStore((state) => state.modalContentVariant);

  useEffect(() => {
    setError(null);
  }, [modalContentVariant]);

  if (modalContentVariant === ModalContentVariant.Hidden) {
    return null;
  }

  const renderModalContent = () => {
    switch (modalContentVariant) {
      case ModalContentVariant.LoginRequired:
        return <LoginRequired setError={setError} onSwitchToSignUp={showSignUp} onSwitchToSignIn={showSignIn} />;
      case ModalContentVariant.SignUpWithEmail:
        return (
          <SignUpWithEmail
            setError={setError}
            continueWithSocial={[<GoogleLoginButton key={GOOGLE_LOGIN_BUTTON_KEY} onClick={continueWithGoogle} />]}
            onFormSent={showConfirmEmail}
            onSwitchToSignIn={showSignIn}
          />
        );
      case ModalContentVariant.SuccessfulSignUp:
        return <SuccessfulSignUp hideAuthModal={hideModal} />;
      case ModalContentVariant.SignInWithEmail:
        return (
          <SignInWithEmail
            setError={setError}
            continueWithSocial={[<GoogleLoginButton key={GOOGLE_LOGIN_BUTTON_KEY} onClick={continueWithGoogle} />]}
            hideAuthModal={hideModal}
            onSwitchToSignUp={showSignUp}
          />
        );
      case ModalContentVariant.ConfirmEmail:
        return <ConfirmEmail hideAuthModal={hideModal} />;
      default:
        return null;
    }
  };

  return (
    <PortalToBody>
      <Modal onClose={hideModal}>
        <div className={cls.authModalContent}>
          {renderModalContent()}
          <p className={cls.errorMessage}>{error?.message}</p>
        </div>
      </Modal>
    </PortalToBody>
  );
};
