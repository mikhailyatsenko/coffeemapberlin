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
    reviewId: string;
    text: string;
  };
}

export function useAddTextReview(placeId: string) {
  const { user, setIsAuthPopup } = useAuth();

  const [addTextReview, { loading, error }] = useMutation<AddTextReviewResponse>(ADD_TEXT_REVIEW, {
    update(cache, { data }) {
      if (data) {
        console.log(
          cache.readQuery<PlaceReviewsData>({
            query: GET_PLACE_REVIEWS,
            variables: { placeId },
          }),
        );
        updatePlaceReviewsCache(cache, data.addTextReview);
      }
    },
  });

  const updatePlaceReviewsCache = (cache: ApolloCache<unknown>, newData: AddTextReviewResponse['addTextReview']) => {
    const existingData = cache.readQuery<PlaceReviewsData>({
      query: GET_PLACE_REVIEWS,
      variables: { placeId },
    });

    if (existingData?.placeReviews) {
      const updatedReviews = [...existingData.placeReviews.reviews];

      const existingReviewIndex = updatedReviews.findIndex((review) => review.id === newData.reviewId);
      if (existingReviewIndex !== -1) {
        updatedReviews[existingReviewIndex] = {
          ...updatedReviews[existingReviewIndex],
          text: newData.text,
        };
      } else {
        updatedReviews.push({
          id: newData.reviewId,
          text: newData.text,
          userId: user!.id,
          userName: user?.displayName || 'Anonymous',
          userAvatar: user?.avatar || '',
          placeId,
          createdAt: new Date().toISOString(),
          isOwnReview: true,
          userRating: null,
        });
      }

      cache.writeQuery<PlaceReviewsData>({
        query: GET_PLACE_REVIEWS,
        variables: { placeId },
        data: {
          placeReviews: {
            id: newData.reviewId,
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
