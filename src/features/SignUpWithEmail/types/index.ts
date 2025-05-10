import type * as Yup from 'yup';
import { type validationSchemaSignUpWithEmail } from '../lib/validationSchema';

export type SignUpWithEmailData = Yup.InferType<typeof validationSchemaSignUpWithEmail>;

export interface SignUpWithEmailProps {
  onSuccessfulSignUp: () => void;
  onSwitchToSignIn: () => void;
  continueWithSocial?: React.ReactNode[];
}
