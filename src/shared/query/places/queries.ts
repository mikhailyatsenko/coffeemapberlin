import { gql } from '@apollo/client';

export const GET_PLACES = gql`
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
        isFavorite
      }
    }
  }
`;

export const GET_PLACE = gql`
  query Place($placeId: ID!) {
    place(placeId: $placeId) {
      id
      type
      geometry {
        type
        coordinates
      }
      properties {
        id
        ratingCount
        openingHours { day hours }
        phone
        website
        characteristicCounts {
          deliciousFilterCoffee { pressed count }
          pleasantAtmosphere { pressed count }
          friendlyStaff { pressed count }
          freeWifi { pressed count }
          yummyEats { pressed count }
          affordablePrices { pressed count }
          petFriendly { pressed count }
          outdoorSeating { pressed count }
        }
      }
    }
  }
`;
