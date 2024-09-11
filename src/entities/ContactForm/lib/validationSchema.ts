import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  message: Yup.string().max(1200, 'Message field must be 1200 characters or less').required('Message is required'),
  recaptcha: Yup.string().required('Please complete the reCAPTCHA'),
});
