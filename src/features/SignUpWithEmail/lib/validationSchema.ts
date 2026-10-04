import * as Yup from 'yup';
import { PASSWORD_MIN_LENGTH } from '../constants';

export const validationSchemaSignUpWithEmail = Yup.object().shape({
  displayName: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('E-mail is required'),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
    .required('Password is required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password repeat is required'),
});
