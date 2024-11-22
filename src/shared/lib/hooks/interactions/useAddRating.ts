import { type ApolloCache, useMutation } from '@apollo/client';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { ADD_RATING, GET_ALL_PLACES, GET_PLACE_REVIEWS } from 'shared/query/apolloQueries';
import { type PlaceResponse } from 'shared/types';
import { type PlaceReviewsData } from './useAddTextReview';

interface AddRatingResponse {
  addRating: {
    averageRating: number;
    ratingCount: number;
    reviewId: string;
    userRating: number;
  };
}

export function useAddReview(placeId: string) {
  const { user, setIsAuthPopup } = useAuth();

  const [addRating, { loading, error }] = useMutation<AddRatingResponse, { placeId: string; rating: number }>(
    ADD_RATING,
    {
      update(cache, { data }) {
        if (data) {
          updateAllPlacesCache(cache, data.addRating);

          updateReviewsCache(cache, data.addRating.userRating, data.addRating.reviewId);
        }
      },
    },
  );

  const updateAllPlacesCache = (cache: ApolloCache<unknown>, newData: AddRatingResponse['addRating']) => {
    const existingData = cache.readQuery<{ places: PlaceResponse[] }>({ query: GET_ALL_PLACES });
    if (existingData?.places) {
      const updatedPlaces = existingData.places.map((place) => {
        if (place.properties.id === placeId) {
          return {
            ...place,
            properties: {
              ...place.properties,
              averageRating: newData.averageRating,
              ratingCount: newData.ratingCount,
            },
          };
        }
        return place;
      });

      cache.writeQuery({
        query: GET_ALL_PLACES,
        data: { places: updatedPlaces },
      });
    }
  };

  const updateReviewsCache = (cache: ApolloCache<unknown>, newRating: number, reviewId: string) => {
    const existingData = cache.readQuery<PlaceReviewsData>({
      query: GET_PLACE_REVIEWS,
      variables: { placeId },
    });

    if (existingData?.placeReviews) {
      const updatedReviews = [...existingData.placeReviews.reviews];
      console.log(existingData.placeReviews.reviews);

      const existingRatingIndex = updatedReviews.findIndex((review) => review.id === reviewId);
      if (existingRatingIndex !== -1) {
        updatedReviews[existingRatingIndex] = {
          ...updatedReviews[existingRatingIndex],
          userRating: newRating,
        };
      } else {
        updatedReviews.push({
          id: reviewId,
          text: '',
          userId: user!.id,
          userName: user?.displayName || 'Anonymous',
          userAvatar: user?.avatar || '',
          placeId,
          createdAt: new Date().toISOString(),
          isOwnReview: true,
          userRating: newRating,
        });
      }

      cache.writeQuery<PlaceReviewsData>({
        query: GET_PLACE_REVIEWS,
        variables: { placeId },
        data: {
          placeReviews: {
            id: placeId,
            reviews: updatedReviews,
          },
        },
      });
    }
  };

  const handleAddRating = async (rating: number): Promise<AddRatingResponse['addRating'] | undefined> => {
    if (!user) {
      setIsAuthPopup('LoginRequired');
      return;
    }
    try {
      const variables: { placeId: string; rating: number } = { placeId, rating };

      await addRating({ variables });
    } catch (err) {
      console.error('Error adding or updating review:', err);
      throw err;
    }
  };

  return {
    handleAddRating,
    loading,
    error,
  };
}
