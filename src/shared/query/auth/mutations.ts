import { gql } from '@apollo/client';

export const LOGIN_WITH_GOOGLE = gql`
  mutation LoginWithGoogle($code: String!) {
    loginWithGoogle(code: $code) {
      user {
        id
        displayName
        email
        avatar
        createdAt
        isGoogleUserUserWithoutPassword
      }
      isFirstLogin
    }
  }
`;

export const SIGN_IN_WITH_EMAIL = gql`
  mutation SignInWithEmail($email: String!, $password: String!) {
    signInWithEmail(email: $email, password: $password) {
      user {
        id
        displayName
        email
        avatar
        createdAt
        isGoogleUserUserWithoutPassword
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser($email: String!, $displayName: String!, $password: String!) {
    registerUser(email: $email, displayName: $displayName, password: $password) {
      success
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

export const CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($token: String!, $email: String!) {
    confirmEmail(token: $token, email: $email) {
      user {
        id
        displayName
        email
        avatar
        createdAt
        isGoogleUserUserWithoutPassword
      }
    }
  }
`;

export const RESEND_CONFIRMATION_EMAIL = gql`
  mutation ResendConfirmationEmail($email: String!) {
    resendConfirmationEmail(email: $email) {
      success
    }
  }
`;
