import { type ApolloCache, useMutation } from '@apollo/client';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { GET_PLACE_REVIEWS, DELETE_REVIEW, GET_ALL_PLACES } from 'shared/query/apolloQueries';
import { type PlaceResponse, type Review } from 'shared/types';

export interface placeReviewsData {
  placeReviews: {
    id: string;
    reviews: Review[];
    favoriteCount: number;
    isFavorite: boolean;
  };
}

interface DeleteReviewResponce {
  deleteReview: {
    reviewId: string;
    averageRating: number;
    ratingCount: number;
  };
}

export function useDeleteReview(placeId: string) {
  const { user, setIsAuthPopup } = useAuth();

  const [deleteReview, { loading: deleteReviewLoading, error: deleteReviewError }] = useMutation<DeleteReviewResponce>(
    DELETE_REVIEW,
    {
      update(cache, { data }) {
        if (data) {
          updateplaceReviewsCacheAfterDelete(cache, data.deleteReview.reviewId);
          updateAllPlacesCache(cache, data.deleteReview);
        }
      },
    },
  );

  const updateplaceReviewsCacheAfterDelete = (cache: ApolloCache<unknown>, reviewId: string) => {
    const existingData = cache.readQuery<placeReviewsData>({
      query: GET_PLACE_REVIEWS,
      variables: { placeId },
    });

    if (existingData?.placeReviews) {
      const updatedReviews = existingData.placeReviews.reviews.filter((review) => review.id !== reviewId);

      cache.writeQuery<placeReviewsData>({
        query: GET_PLACE_REVIEWS,
        variables: { placeId },
        data: {
          placeReviews: {
            id: existingData.placeReviews.id,
            isFavorite: existingData.placeReviews.isFavorite,
            favoriteCount: existingData.placeReviews.favoriteCount,
            reviews: updatedReviews,
          },
        },
      });
    }
  };

  const updateAllPlacesCache = (cache: ApolloCache<unknown>, newData: DeleteReviewResponce['deleteReview']) => {
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

  const handleDeleteReview = async (
    reviewId: string,
    deleteOptions: 'deleteReviewText' | 'deleteRating' | 'deleteAll' = 'deleteAll',
  ): Promise<void> => {
    if (!user) {
      setIsAuthPopup('LoginRequired');
      return;
    }
    try {
      await deleteReview({ variables: { reviewId, deleteOptions } });
    } catch (err) {
      console.error('Error deleting review:', err);
      throw err;
    }
  };

  return {
    handleDeleteReview,
    loading: deleteReviewLoading,
    error: deleteReviewError,
  };
}
