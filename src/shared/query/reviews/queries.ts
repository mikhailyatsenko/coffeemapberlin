import { gql } from '@apollo/client';

export const PLACE_REVIEWS = gql`
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
        reviewImages
      }
    }
  }
`;

export const USER_REVIEW_ACTIVITY = gql`
  query UserReviewActivity {
    userReviewActivity {
      rating
      reviewText
      placeId
      placeName
      averageRating
      createdAt
    }
  }
`;
