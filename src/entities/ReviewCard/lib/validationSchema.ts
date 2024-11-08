import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
  review: Yup.string().max(1000, 'Review field must be 1000 characters or less').required('Review is required'),
});
