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
      user {
        id
        displayName
        email
      }
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

export const ADD_REVIEW = gql`
  mutation AddReview($placeId: ID!, $text: String, $rating: Float) {
    addReview(placeId: $placeId, text: $text, rating: $rating) {
      review {
        id
        text
        userId
        userName
        userAvatar
        placeId
        createdAt
        isOwnReview
        userRating
      }
      averageRating
      ratingCount
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId) {
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
      review
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
