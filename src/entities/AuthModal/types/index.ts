import type * as Yup from 'yup';
import { type validationSchemaSignUpWithEmail, type validationSchemaSignInWithEmail } from '../lib/validationSchema';

export type SignUpWithEmailData = Yup.InferType<typeof validationSchemaSignUpWithEmail>;

export type SignInWithEmailData = Yup.InferType<typeof validationSchemaSignInWithEmail>;
