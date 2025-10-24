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
          googleId
        }
      }
      total
    }
  }
`;

export const GET_FAVORITE_PLACES = gql`
  query GetFavoritePlaces {
    favoritePlaces {
      id
      name
      address
      image
      instagram
      averageRating
      isFavorite
      neighborhood
      googleId
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
        images
        instagram
        averageRating
        isFavorite
        neighborhood
        ratingCount
        googleId
        openingHours {
          day
          hours
        }
        additionalInfo
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
