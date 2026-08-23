import { gql } from '@apollo/client';

export const TOGGLE_FAVORITE = gql`
  mutation ToggleFavorite($placeId: ID!) {
    toggleFavorite(placeId: $placeId)
  }
`;

export const TOGGLE_CHARACTERISTIC = gql`
  mutation ToggleCharacteristic(
    $placeId: ID!
    $characteristic: Characteristic!
    $guestId: String
    $guestSecret: String
  ) {
    toggleCharacteristic(
      placeId: $placeId
      characteristic: $characteristic
      guestId: $guestId
      guestSecret: $guestSecret
    ) {
      success
    }
  }
`;
