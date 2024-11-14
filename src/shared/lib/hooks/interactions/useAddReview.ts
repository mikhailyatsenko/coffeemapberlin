import { type ApolloCache, useMutation } from '@apollo/client';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { ADD_REVIEW, GET_PLACE_REVIEWS, GET_ALL_PLACES } from 'shared/query/apolloQueries';
import { type PlaceResponse, type Review } from 'shared/types';

export interface placeReviewsData {
  placeReviews: {
    id: string;
    reviews: Review[];
  };
}

interface AddReviewResponse {
  addReview: {
    review: Review;
    averageRating: number;
    ratingCount: number;
  };
}

export function useAddReview(placeId: string) {
  const { user, setIsAuthPopup } = useAuth();

  const [addReview, { loading: addReviewLoading, error: addReviewError }] = useMutation<AddReviewResponse>(ADD_REVIEW, {
    update(cache, { data }) {
      if (data) {
        updateAllPlacesCache(cache, data.addReview);
        updateplaceReviewsCache(cache, data.addReview);
      }
    },
  });

  const updateAllPlacesCache = (cache: ApolloCache<unknown>, newData: AddReviewResponse['addReview']) => {
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

  const updateplaceReviewsCache = (cache: ApolloCache<unknown>, newData: AddReviewResponse['addReview']) => {
    const existingData = cache.readQuery<placeReviewsData>({
      query: GET_PLACE_REVIEWS,
      variables: { placeId: newData.review.placeId },
    });

    if (existingData?.placeReviews) {
      let updatedReviews = [...existingData.placeReviews.reviews];

      const existingReviewIndex = updatedReviews.findIndex((review) => review.id === newData.review.id);
      if (existingReviewIndex !== -1) {
        updatedReviews[existingReviewIndex] = newData.review;
      } else {
        updatedReviews = [newData.review, ...updatedReviews];
      }

      cache.writeQuery<placeReviewsData>({
        query: GET_PLACE_REVIEWS,
        variables: { placeId: newData.review.placeId },
        data: {
          placeReviews: {
            id: newData.review.id,
            reviews: updatedReviews,
          },
        },
      });
    }
  };

  const handleAddReview = async (text?: string, rating?: number): Promise<Review | undefined> => {
    if (!user) {
      setIsAuthPopup('LoginRequired');
      return;
    }
    try {
      const variables: { placeId: string; text?: string; rating?: number } = { placeId };

      if (text !== undefined) variables.text = text;
      if (rating !== undefined) variables.rating = rating;

      await addReview({ variables });
    } catch (err) {
      console.error('Error adding or updating review:', err);
      throw err;
    }
  };

  return {
    handleAddReview,
    loading: addReviewLoading,
    error: addReviewError,
  };
}
