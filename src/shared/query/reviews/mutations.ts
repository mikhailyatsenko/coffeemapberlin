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
  mutation AddTextReview($placeId: ID!, $text: String!, $reviewImages: Int) {
    addTextReview(placeId: $placeId, text: $text, reviewImages: $reviewImages) {
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
