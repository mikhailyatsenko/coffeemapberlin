import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  placeName: Yup.string().required('Place name is required'),
  placeId: Yup.string().required('Place ID is required'),
  message: Yup.string().max(1200, 'Message field must be 1200 characters or less').required('Message is required'),
  recaptcha: Yup.string().required('Please complete the reCAPTCHA'),
});
