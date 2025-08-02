import { gql } from '@apollo/client';

export const SUBMIT_CONTACT_FORM = gql`
  mutation ContactForm($name: String!, $email: String!, $message: String!) {
    contactForm(name: $name, email: $email, message: $message) {
      success
      name
    }
  }
`;
