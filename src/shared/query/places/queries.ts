import { gql } from '@apollo/client';

export const GET_PLACES = gql`
  query GetPlaces($limit: Int, $offset: Int) {
    places(limit: $limit, offset: $offset) {
      places {
        id
        type
        geometry {
          type
          coordinates
        }
        properties {
          id
          name
          description
          address
          image
          instagram
          averageRating
          isFavorite
          neighborhood
        }
      }
      total
    }
  }
`;

export const GET_PLACE = gql`
  query Place($placeId: ID!) {
    place(placeId: $placeId) {
      id
      geometry {
        type
        coordinates
      }
      properties {
        id
        name
        description
        address
        image
        instagram
        averageRating
        isFavorite
        neighborhood
        ratingCount
        openingHours {
          day
          hours
        }
        phone
        website
        characteristicCounts {
          deliciousFilterCoffee {
            pressed
            count
          }
          pleasantAtmosphere {
            pressed
            count
          }
          friendlyStaff {
            pressed
            count
          }
          freeWifi {
            pressed
            count
          }
          yummyEats {
            pressed
            count
          }
          affordablePrices {
            pressed
            count
          }
          petFriendly {
            pressed
            count
          }
          outdoorSeating {
            pressed
            count
          }
        }
      }
    }
  }
`;
