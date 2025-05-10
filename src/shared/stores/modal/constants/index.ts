import { type ModalState } from '../types';

export enum ModalContentVariant {
  LoginRequired = 'LoginRequired',
  SignUpWithEmail = 'SignUpWithEmail',
  SignInWithEmail = 'SignInWithEmail',
  SuccessfulSignUp = 'SuccessfulSignUp',
  Hidden = 'Hidden',
}

export const INITIAL_STATE: ModalState = {
  modalContentVariant: ModalContentVariant.Hidden,
};
