import { gql } from '@apollo/client';

export const CREATE_GUEST_IDENTITY = gql`
  mutation CreateGuestIdentity($captchaToken: String) {
    createGuestIdentity(captchaToken: $captchaToken) {
      guestId
      guestSecret
    }
  }
`;

export const CLAIM_GUEST_REVIEWS = gql`
  mutation ClaimGuestReviews($guestId: String!, $guestSecret: String!) {
    claimGuestReviews(guestId: $guestId, guestSecret: $guestSecret) {
      claimedCount
      conflictedCount
    }
  }
`;
