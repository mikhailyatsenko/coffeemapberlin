import { gql } from '@apollo/client';

export const SUBMIT_PLACE_SUGGESTION = gql`
  mutation SubmitPlaceSuggestion($input: PlaceSuggestionInput!, $guestId: String, $guestSecret: String) {
    submitPlaceSuggestion(input: $input, guestId: $guestId, guestSecret: $guestSecret)
  }
`;

export const PUBLISH_PLACE_SUGGESTION = gql`
  mutation PublishPlaceSuggestion($id: ID!, $token: String!, $input: PublishPlaceSuggestionInput!) {
    publishPlaceSuggestion(id: $id, token: $token, input: $input) {
      status
      publishedPlaceId
    }
  }
`;

export const REJECT_PLACE_SUGGESTION = gql`
  mutation RejectPlaceSuggestion($id: ID!, $token: String!) {
    rejectPlaceSuggestion(id: $id, token: $token) {
      status
      publishedPlaceId
    }
  }
`;
