import * as Yup from 'yup';

export const validationSchemaSignUpWithEmail = Yup.object().shape({
  displayName: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('E-mail is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters long').required('Password is required'),
  repeatPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Password repeat is required'),
  recaptcha: Yup.string().required('Please complete the reCAPTCHA'),
});
