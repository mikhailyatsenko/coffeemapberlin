import { gql } from '@apollo/client';

export const UPDATE_PERSONAL_DATA = gql`
  mutation UpdatePersonalData($userId: ID!, $displayName: String, $email: String) {
    updatePersonalData(userId: $userId, displayName: $displayName, email: $email) {
      success
    }
  }
`;

export const SET_NEW_PASSWORD = gql`
  mutation SetNewPassword($userId: ID!, $oldPassword: String, $newPassword: String!) {
    setNewPassword(userId: $userId, oldPassword: $oldPassword, newPassword: $newPassword) {
      success
    }
  }
`;

export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($userId: ID!, $fileUrl: String!) {
    uploadAvatar(userId: $userId, fileUrl: $fileUrl) {
      success
    }
  }
`;

export const DELETE_AVATAR = gql`
  mutation DeleteAvatar {
    deleteAvatar {
      success
    }
  }
`;
