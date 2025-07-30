import { type ApolloCache } from '@apollo/client';

import {
  type AddRatingMutation,
  GetAllPlacesDocument,
  type GetAllPlacesQuery,
  PlaceReviewsDocument,
  type PlaceReviewsQuery,
  useAddRatingMutation,
} from 'shared/generated/graphql';
import { useAuthStore } from 'shared/stores/auth';
import { showLoginRequired } from 'shared/stores/modal';

export function useAddRating(placeId: string) {
  const { user } = useAuthStore();

  const [addRating, { loading, error }] = useAddRatingMutation({
    update(cache, { data }) {
      if (data) {
        updateAllPlacesCache(cache, data.addRating);
        updateReviewsCache(cache, data.addRating.userRating, data.addRating.reviewId);
      }
    },
  });

  const updateAllPlacesCache = (cache: ApolloCache<unknown>, newData: NonNullable<AddRatingMutation['addRating']>) => {
    const existingData = cache.readQuery<GetAllPlacesQuery>({ query: GetAllPlacesDocument });
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
        query: GetAllPlacesDocument,
        data: { places: updatedPlaces },
      });
    }
  };

  const updateReviewsCache = (cache: ApolloCache<unknown>, newRating: number, reviewId: string) => {
    const existingData = cache.readQuery<PlaceReviewsQuery>({
      query: PlaceReviewsDocument,
      variables: { placeId },
    });

    if (existingData?.placeReviews) {
      const updatedReviews = [...existingData.placeReviews.reviews];
      const existingRatingIndex = updatedReviews.findIndex((review) => review.id === reviewId);
      if (existingRatingIndex !== -1) {
        updatedReviews[existingRatingIndex] = {
          ...updatedReviews[existingRatingIndex],
          userRating: newRating,
          imgCount: existingData.placeReviews.reviews[existingRatingIndex].imgCount,
        };
      } else {
        updatedReviews.push({
          id: reviewId,
          text: '',
          userId: user!.id,
          userName: user?.displayName || 'Anonymous',
          userAvatar: user?.avatar || '',
          createdAt: new Date().toISOString(),
          isOwnReview: true,
          userRating: newRating,
          imgCount: 0,
        });
      }

      cache.writeQuery<PlaceReviewsQuery>({
        query: PlaceReviewsDocument,
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

  const handleAddRating = async (rating: number): Promise<NonNullable<AddRatingMutation['addRating']> | undefined> => {
    if (!user) {
      showLoginRequired();
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
