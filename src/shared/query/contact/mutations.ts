import { gql } from '@apollo/client';

export const SUBMIT_CONTACT_FORM = gql`
  mutation ContactForm($name: String!, $email: String!, $message: String!, $captchaToken: String) {
    contactForm(name: $name, email: $email, message: $message, captchaToken: $captchaToken) {
      success
      name
    }
  }
`;
