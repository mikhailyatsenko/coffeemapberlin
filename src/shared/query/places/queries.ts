import { gql } from '@apollo/client';

export const PLACES = gql`
  query GetAllPlaces {
    places {
      type
      geometry {
        type
        coordinates
      }
      properties {
        id
        name
        description
        neighborhood
        address
        image
        instagram
        averageRating
        ratingCount
        isFavorite
        favoriteCount
        characteristicCounts {
          pleasantAtmosphere {
            pressed
            count
          }
          affordablePrices {
            pressed
            count
          }
          friendlyStaff {
            pressed
            count
          }
          yummyEats {
            pressed
            count
          }
          deliciousFilterCoffee {
            pressed
            count
          }
          freeWifi {
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
