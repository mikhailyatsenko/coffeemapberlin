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
      emailChanged
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

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
    }
  }
`;

export const VALIDATE_PASSWORD_RESET_TOKEN = gql`
  mutation ValidatePasswordResetToken($email: String!, $token: String!) {
    validatePasswordResetToken(email: $email, token: $token) {
      success
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!, $token: String!, $newPassword: String!) {
    resetPassword(email: $email, token: $token, newPassword: $newPassword) {
      success
    }
  }
`;
