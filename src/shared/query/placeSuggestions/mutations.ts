import { gql } from '@apollo/client';

export const SUBMIT_PLACE_SUGGESTION = gql`
  mutation SubmitPlaceSuggestion($input: PlaceSuggestionInput!, $guestId: String, $guestSecret: String) {
    submitPlaceSuggestion(input: $input, guestId: $guestId, guestSecret: $guestSecret)
  }
`;

export const UPLOAD_PLACE_SUGGESTION_PHOTO = gql`
  mutation UploadPlaceSuggestionPhoto(
    $suggestionId: ID!
    $fileBuffer: String!
    $guestId: String
    $guestSecret: String
  ) {
    uploadPlaceSuggestionPhoto(
      suggestionId: $suggestionId
      fileBuffer: $fileBuffer
      guestId: $guestId
      guestSecret: $guestSecret
    ) {
      photoCount
    }
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

export const UPLOAD_PLACE_SUGGESTION_PHOTO_AS_ADMIN = gql`
  mutation UploadPlaceSuggestionPhotoAsAdmin($id: ID!, $token: String!, $fileBuffer: String!) {
    uploadPlaceSuggestionPhotoAsAdmin(id: $id, token: $token, fileBuffer: $fileBuffer)
  }
`;

export const DELETE_PLACE_SUGGESTION_PHOTO = gql`
  mutation DeletePlaceSuggestionPhoto($id: ID!, $token: String!, $path: String!) {
    deletePlaceSuggestionPhoto(id: $id, token: $token, path: $path)
  }
`;
