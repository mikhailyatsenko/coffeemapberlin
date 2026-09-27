import * as Yup from 'yup';
import { SUGGESTION_MAX_LENGTH } from '../constants';

const tooLong = (label: string, max: number) => `${label} must be ${max} characters or less`;

export const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required('Name is required')
    .max(SUGGESTION_MAX_LENGTH.name, tooLong('Name', SUGGESTION_MAX_LENGTH.name)),
  address: Yup.string()
    .trim()
    .required('Address is required')
    .max(SUGGESTION_MAX_LENGTH.address, tooLong('Address', SUGGESTION_MAX_LENGTH.address)),
  description: Yup.string()
    .trim()
    .max(SUGGESTION_MAX_LENGTH.description, `Keep it to ${SUGGESTION_MAX_LENGTH.description} characters or less`)
    .defined(),
  instagram: Yup.string()
    .trim()
    .max(SUGGESTION_MAX_LENGTH.instagram, tooLong('Instagram', SUGGESTION_MAX_LENGTH.instagram))
    .defined(),
  email: Yup.string()
    .trim()
    .email('Enter a valid email')
    .max(SUGGESTION_MAX_LENGTH.email, tooLong('Email', SUGGESTION_MAX_LENGTH.email))
    .defined(),
});
