import type * as Yup from 'yup';
import { type AuthModalContentVariant } from '../constants';
import { type validationSchemaSignUpWithEmail, type validationSchemaSignInWithEmail } from '../lib/validationSchema';

export type SignUpWithEmailData = Yup.InferType<typeof validationSchemaSignUpWithEmail>;

export type SignInWithEmailData = Yup.InferType<typeof validationSchemaSignInWithEmail>;

export interface AuthModalProps {
  authModalContentVariant: AuthModalContentVariant;
  setAuthModalContentVariant: (variant: AuthModalContentVariant) => void;
}
