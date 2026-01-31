import { gql } from '@apollo/client';

export const SUBMIT_REPORT_INACCURACY = gql`
  mutation ReportInaccuracy($placeId: String!, $placeName: String!, $message: String!) {
    reportInaccuracy(placeId: $placeId, placeName: $placeName, message: $message) {
      success
      placeName
    }
  }
`;
