import { gql } from '@apollo/client';

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

export const ADD_REVIEW = gql`
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

export const UPLOAD_REVIEW_IMAGES = gql`
  mutation UploadReviewImages($placeId: ID!, $images: [String!]!) {
    uploadReviewImages(placeId: $placeId, images: $images) {
      success
      count
      filePaths
    }
  }
`;
