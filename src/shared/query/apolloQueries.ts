import { gql } from '@apollo/client';

export const LOGIN_WITH_GOOGLE_MUTATION = gql`
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

export const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      displayName
      email
      avatar
      createdAt
      isGoogleUserUserWithoutPassword
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

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      message
    }
  }
`;

export const GET_ALL_PLACES = gql`
  query GetAllPlaces {
    places {
      type
      geometry {
        type
        coordinates
      }
      properties {
        id
        name
        description
        address
        image
        instagram
        averageRating
        ratingCount
        isFavorite
        favoriteCount
        characteristicCounts {
          pleasantAtmosphere {
            pressed
            count
          }
          affordablePrices {
            pressed
            count
          }
          friendlyStaff {
            pressed
            count
          }
          yummyEats {
            pressed
            count
          }
          deliciousFilterCoffee {
            pressed
            count
          }

          freeWifi {
            pressed
            count
          }
          petFriendly {
            pressed
            count
          }
          outdoorSeating {
            pressed
            count
          }
        }
      }
    }
  }
`;

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($placeId: ID!) {
    toggleFavorite(placeId: $placeId)
  }
`;

export const TOGGLE_CHARACTERISTIC = gql`
  mutation ToggleCharacteristic($placeId: ID!, $characteristic: Characteristic!) {
    toggleCharacteristic(placeId: $placeId, characteristic: $characteristic) {
      success
    }
  }
`;

export const ADD_RATING = gql`
  mutation AddRating($placeId: ID!, $rating: Float!) {
    addRating(placeId: $placeId, rating: $rating) {
      averageRating
      ratingCount
      reviewId
      userRating
    }
  }
`;

export const ADD_TEXT_REVIEW = gql`
  mutation AddTextReview($placeId: ID!, $text: String!) {
    addTextReview(placeId: $placeId, text: $text) {
      reviewId
      text
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!, $deleteOptions: String!) {
    deleteReview(reviewId: $reviewId, deleteOptions: $deleteOptions) {
      reviewId
      averageRating
      ratingCount
    }
  }
`;

export const GET_PLACE_REVIEWS = gql`
  query PlaceReviews($placeId: ID!) {
    placeReviews(placeId: $placeId) {
      id
      reviews {
        id
        text
        userId
        userName
        userAvatar
        createdAt
        userRating
        isOwnReview
      }
    }
  }
`;

export const GET_USER_REVIEW_ACTIVITY = gql`
  query getUserReviewActivity {
    getUserReviewActivity {
      rating
      reviewText
      placeId
      placeName
      averageRating
      createdAt
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

export const CONTACT_FORM = gql`
  mutation ContactForm($name: String!, $email: String!, $message: String!) {
    contactForm(name: $name, email: $email, message: $message) {
      success
      name
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

export const RESEND_CONFIRM_EMAIL = gql`
  mutation ResendConfirmationEmail($email: String!) {
    resendConfirmationEmail(email: $email) {
      success
    }
  }
`;
