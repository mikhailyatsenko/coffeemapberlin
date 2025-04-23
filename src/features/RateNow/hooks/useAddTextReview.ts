import { type ApolloCache } from '@apollo/client';
import {
  type AddTextReviewMutation,
  PlaceReviewsDocument,
  type PlaceReviewsQuery,
  useAddTextReviewMutation,
} from 'shared/generated/graphql';
import { useAuth } from 'shared/hooks';

export function useAddTextReview(placeId: string) {
  const { user, setAuthModalContentVariant } = useAuth();

  const [addTextReview, { loading, error }] = useAddTextReviewMutation({
    update(cache, { data }) {
      if (data) {
        updatePlaceReviewsCache(cache, data.addTextReview);
      }
    },
  });

  const updatePlaceReviewsCache = (
    cache: ApolloCache<unknown>,
    newData: NonNullable<AddTextReviewMutation['addTextReview']>,
  ) => {
    const existingData = cache.readQuery<PlaceReviewsQuery>({
      query: PlaceReviewsDocument,
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
          createdAt: new Date().toISOString(),
          isOwnReview: true,
          userRating: null,
        });
      }

      cache.writeQuery<PlaceReviewsQuery>({
        query: PlaceReviewsDocument,
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

  const handleAddTextReview = async (
    text: string,
  ): Promise<NonNullable<AddTextReviewMutation['addTextReview']> | undefined> => {
    if (!user) {
      setAuthModalContentVariant('LoginRequired');
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
