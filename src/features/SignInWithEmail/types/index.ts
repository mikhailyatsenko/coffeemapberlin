import type * as Yup from 'yup';
import { type validationSchemaSignInWithEmail } from '../lib/validationSchema';

export type SignInWithEmailData = Yup.InferType<typeof validationSchemaSignInWithEmail>;

export interface SignInWithEmailProps {
  hideAuthModal?: () => void;
  onSwitchToSignUp: () => void;
  continueWithSocial?: React.ReactNode[];
  setError: (error: Error | null) => void;
}
