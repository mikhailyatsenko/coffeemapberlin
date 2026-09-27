import { gql } from '@apollo/client';

export const PLACE_SUGGESTION_FOR_REVIEW = gql`
  query PlaceSuggestionForReview($id: ID!, $token: String!) {
    placeSuggestionForReview(id: $id, token: $token) {
      id
      name
      address
      description
      instagram
      suggestedBy
      status
      publishedPlaceId
      photos
      similarPending {
        id
        name
        address
      }
    }
  }
`;

export const FIND_GOOGLE_IDS_FOR_SUGGESTION = gql`
  query FindGoogleIdsForSuggestion($id: ID!, $token: String!) {
    findGoogleIdsForSuggestion(id: $id, token: $token) {
      googleId
      existingPlaceId
    }
  }
`;
