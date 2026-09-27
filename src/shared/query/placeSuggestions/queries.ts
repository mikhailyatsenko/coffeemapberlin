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
      similarPending {
        id
        name
        address
      }
    }
  }
`;
