import { type ModalState } from '../types';

export enum ModalContentVariant {
  LoginRequired = 'LoginRequired',
  SignUpWithEmail = 'SignUpWithEmail',
  SignInWithEmail = 'SignInWithEmail',
  SuccessfulSignUp = 'SuccessfulSignUp',
  ConfirmEmail = 'ConfirmEmail',
  ResendConfirmationEmailByExpired = 'ResendConfirmationEmailByExpired',
  ResendConfirmationEmailByError = 'ResendConfirmationEmailByError',

  Hidden = 'Hidden',
}

export const INITIAL_STATE: ModalState = {
  modalContentVariant: ModalContentVariant.Hidden,
};
