import { type ApolloCache } from '@apollo/client';
import { useCallback } from 'react';
import {
  useDeleteReviewMutation,
  type GetAllPlacesQuery,
  type PlaceReviewsQuery,
  GetAllPlacesDocument,
  PlaceReviewsDocument,
} from 'shared/generated/graphql';
import { useAuth } from './useAuth';

type DeleteOptions = 'deleteReviewText' | 'deleteRating' | 'deleteAll';

export function useDeleteReview(placeId: string) {
  const { user, setAuthModalContentVariant } = useAuth();

  const [deleteReview, { loading: deleteReviewLoading, error: deleteReviewError }] = useDeleteReviewMutation({
    update(cache, result, { variables }) {
      if (result.data?.deleteReview) {
        updateAllPlacesCache(cache as ApolloCache<GetAllPlacesQuery>, result.data.deleteReview);
        const deleteOptions = variables?.deleteOptions as DeleteOptions;
        if (deleteOptions) {
          updatePlaceReviewsCacheAfterDelete(
            cache as ApolloCache<PlaceReviewsQuery>,
            result.data.deleteReview.reviewId,
            deleteOptions,
          );
        }
      }
    },
  });

  const updatePlaceReviewsCacheAfterDelete = (
    cache: ApolloCache<GetAllPlacesQuery | PlaceReviewsQuery>,
    reviewId: string,
    deleteOptions: DeleteOptions,
  ) => {
    const existingData = cache.readQuery<PlaceReviewsQuery>({
      query: PlaceReviewsDocument,
      variables: { placeId },
    });

    if (existingData?.placeReviews) {
      const updatedReviews = [...existingData.placeReviews.reviews];
      updatedReviews.forEach((review, index) => {
        if (review.id === reviewId) {
          switch (deleteOptions) {
            case 'deleteReviewText':
              if (updatedReviews[index].userRating) {
                updatedReviews[index] = { ...review, text: '' };
              } else {
                updatedReviews.splice(index, 1);
              }
              break;
            case 'deleteRating':
              if (updatedReviews[index].text) {
                updatedReviews[index] = { ...review, userRating: null };
              } else {
                updatedReviews.splice(index, 1);
              }
              break;
            case 'deleteAll':
              updatedReviews.splice(index, 1);
              break;
          }
        }
      });

      cache.writeQuery({
        query: PlaceReviewsDocument,
        variables: { placeId },
        data: {
          placeReviews: {
            id: existingData.placeReviews.id,
            reviews: updatedReviews,
          },
        },
      });
    }
  };

  const updateAllPlacesCache = (
    cache: ApolloCache<unknown>,
    newData: { averageRating: number; ratingCount: number },
  ) => {
    const existingData = cache.readQuery<GetAllPlacesQuery>({
      query: GetAllPlacesDocument,
    });

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

  const handleDeleteReview = useCallback(
    async (reviewId: string, deleteOptions: DeleteOptions = 'deleteAll'): Promise<void> => {
      if (!user) {
        setAuthModalContentVariant('LoginRequired');
        return;
      }
      try {
        await deleteReview({ variables: { reviewId, deleteOptions } });
      } catch (err) {
        console.error('Error deleting review:', err);
        throw err;
      }
    },
    [user, deleteReview, setAuthModalContentVariant],
  );

  return {
    handleDeleteReview,
    loading: deleteReviewLoading,
    error: deleteReviewError,
  };
}
