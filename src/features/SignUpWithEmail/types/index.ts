import type * as Yup from 'yup';
import { type validationSchemaSignUpWithEmail } from '../lib/validationSchema';

export type SignUpWithEmailData = Yup.InferType<typeof validationSchemaSignUpWithEmail>;

export interface SignUpWithEmailProps {
  onFormSent: () => void;
  onSwitchToSignIn: () => void;
  continueWithSocial?: React.ReactNode[];
  setError: (error: Error | null) => void;
}
