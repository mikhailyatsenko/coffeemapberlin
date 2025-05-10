import { useEffect, useState } from 'react';
import { useWithGoogle } from 'features/ContinueWithGoogle';
import { SignInWithEmail } from 'features/SignInWithEmail';
import { SignUpWithEmail } from 'features/SignUpWithEmail';

import { hideModal, showSignIn, showSignUp, showSuccessfulSignUp, useModalStore } from 'shared/stores/modal';
import { ModalContentVariant } from 'shared/stores/modal/constants';
import { GOOGLE_LOGIN_BUTTON_KEY, GoogleLoginButton } from 'shared/ui/GoogleLoginButton';
import { Modal } from 'shared/ui/Modal';
import { PortalToBody } from 'shared/ui/Portals/PortalToBody';
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

  return (
    <PortalToBody>
      <Modal onClose={hideModal}>
        <div className={cls.authModalContent}>
          {modalContentVariant === ModalContentVariant.LoginRequired && (
            <LoginRequired setError={setError} onSwitchToSignUp={showSignUp} onSwitchToSignIn={showSignIn} />
          )}
          {modalContentVariant === ModalContentVariant.SignUpWithEmail && (
            <SignUpWithEmail
              setError={setError}
              continueWithSocial={[<GoogleLoginButton key={GOOGLE_LOGIN_BUTTON_KEY} onClick={continueWithGoogle} />]}
              onSuccessfulSignUp={showSuccessfulSignUp}
              onSwitchToSignIn={showSignIn}
            />
          )}
          {modalContentVariant === ModalContentVariant.SuccessfulSignUp && (
            <SuccessfulSignUp hideAuthModal={hideModal} />
          )}
          {modalContentVariant === ModalContentVariant.SignInWithEmail && (
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
