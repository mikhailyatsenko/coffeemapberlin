import * as Yup from 'yup';

export const confirmEmailValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('E-mail is required'),
});
