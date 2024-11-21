import { type ApolloCache, useMutation } from '@apollo/client';
import { useAuth } from 'shared/lib/reactContext/Auth/useAuth';
import { ADD_TEXT_REVIEW, GET_PLACE_REVIEWS } from 'shared/query/apolloQueries';
import { type Review } from 'shared/types';

export interface PlaceReviewsData {
  placeReviews: {
    id: string;
    reviews: Review[];
  };
}

interface AddTextReviewResponse {
  addTextReview: {
    review: Review;
  };
}

export function useAddTextReview(placeId: string) {
  const { user, setIsAuthPopup } = useAuth();

  const [addTextReview, { loading, error }] = useMutation<AddTextReviewResponse>(ADD_TEXT_REVIEW, {
    update(cache, { data }) {
      if (data) {
        updatePlaceReviewsCache(cache, data.addTextReview);
      }
    },
  });

  const updatePlaceReviewsCache = (cache: ApolloCache<unknown>, newData: AddTextReviewResponse['addTextReview']) => {
    const existingData = cache.readQuery<PlaceReviewsData>({
      query: GET_PLACE_REVIEWS,
      variables: { placeId: newData.review.placeId },
    });

    if (existingData?.placeReviews) {
      let updatedReviews = [...existingData.placeReviews.reviews];

      const existingReviewIndex = updatedReviews.findIndex((review) => review.id === newData.review.id);
      if (existingReviewIndex !== -1) {
        updatedReviews[existingReviewIndex] = {
          ...updatedReviews[existingReviewIndex],
          text: newData.review.text,
        };
      } else {
        updatedReviews = [newData.review, ...updatedReviews];
      }

      cache.writeQuery<PlaceReviewsData>({
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

  const handleAddTextReview = async (text: string): Promise<AddTextReviewResponse['addTextReview'] | undefined> => {
    if (!user) {
      setIsAuthPopup('LoginRequired');
      return;
    }
    try {
      const variables: { placeId: string; text: string } = { placeId, text };
      await addTextReview({ variables });
    } catch (err) {
      console.error('Error adding or updating review:', err);
      throw err;
    }
  };

  return {
    handleAddTextReview,
    loading,
    error,
  };
}
