import { gql } from '@apollo/client';

export const SUBMIT_PLACE_SUGGESTION = gql`
  mutation SubmitPlaceSuggestion($input: PlaceSuggestionInput!, $guestId: String, $guestSecret: String) {
    submitPlaceSuggestion(input: $input, guestId: $guestId, guestSecret: $guestSecret)
  }
`;
