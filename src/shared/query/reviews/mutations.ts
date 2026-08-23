import { gql } from '@apollo/client';

export const ADD_RATING = gql`
  mutation AddRating($placeId: ID!, $rating: Float!, $guestId: String, $guestSecret: String) {
    addRating(placeId: $placeId, rating: $rating, guestId: $guestId, guestSecret: $guestSecret) {
      averageRating
      ratingCount
      reviewId
      userRating
    }
  }
`;

export const ADD_REVIEW = gql`
  mutation AddTextReview($placeId: ID!, $text: String!, $guestId: String, $guestSecret: String) {
    addTextReview(placeId: $placeId, text: $text, guestId: $guestId, guestSecret: $guestSecret) {
      reviewId
      text
    }
  }
`;

export const UPLOAD_REVIEW_IMAGE = gql`
  mutation UploadReviewImage($reviewId: ID!, $fileBuffer: String!, $guestId: String, $guestSecret: String) {
    uploadReviewImage(reviewId: $reviewId, fileBuffer: $fileBuffer, guestId: $guestId, guestSecret: $guestSecret) {
      reviewImages
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
