import { ModalContentVariant } from '../constants';
import { useModalStore } from '../hooks';

export const showSignUp = () => {
  useModalStore.setState({ modalContentVariant: ModalContentVariant.SignUpWithEmail });
};

export const showSignIn = () => {
  useModalStore.setState({ modalContentVariant: ModalContentVariant.SignInWithEmail });
};
export const showLoginRequired = () => {
  useModalStore.setState({ modalContentVariant: ModalContentVariant.LoginRequired });
};

export const showSuccessfulSignUp = () => {
  useModalStore.setState({ modalContentVariant: ModalContentVariant.SuccessfulSignUp });
};

export const hideModal = () => {
  useModalStore.setState({ modalContentVariant: ModalContentVariant.Hidden });
};

export const showConfirmEmail = () => {
  useModalStore.setState({ modalContentVariant: ModalContentVariant.ConfirmEmail });
};

export const showResendConfirmationEmail = (isExpired: boolean) => {
  if (isExpired) {
    useModalStore.setState({ modalContentVariant: ModalContentVariant.ResendConfirmationEmailByExpired });
  } else {
    useModalStore.setState({ modalContentVariant: ModalContentVariant.ResendConfirmationEmailByError });
  }
};
