import { useMutation, useQuery } from '@apollo/client';
import { ADD_REVIEW, GET_PLACE_DETAILS, GET_ALL_PLACES } from 'shared/query/places';
import { type PlaceResponse } from 'shared/types';

export interface Review {
  id: string;
  text: string;
  userId: string;
  userRating?: number;
  userName: string;
  userAvatar: string;
  placeId: string;
  createdAt: string;
  isOwnReview: boolean;
}

export interface PlaceDetailsData {
  placeDetails: {
    reviews: Review[];
    favoriteCount: number;
    isFavorite: boolean;
  };
}

interface AddReviewResponse {
  addReview: {
    review: Review;
    averageRating: number;
    ratingCount: number;
  };
}

export function useReview(placeId: string) {
  const { data: allPlacesData } = useQuery<{ places: PlaceResponse[] }>(GET_ALL_PLACES);

  const [addReview, { loading: addReviewLoading, error: addReviewError }] = useMutation<AddReviewResponse>(ADD_REVIEW, {
    refetchQueries: [{ query: GET_PLACE_DETAILS, variables: { placeId } }, { query: GET_ALL_PLACES }],
    awaitRefetchQueries: true,
  });

  const handleAddReview = async (text?: string, rating?: number): Promise<Review | undefined> => {
    try {
      const variables: { placeId: string; text?: string; rating?: number } = { placeId };
      if (text !== undefined) variables.text = text;
      if (rating !== undefined) variables.rating = rating;

      const { data } = await addReview({ variables });
      console.log('Review added or updated:', data?.addReview.review);
      return data?.addReview.review;
    } catch (err) {
      console.error('Error adding or updating review:', err);
      throw err;
    }
  };

  return {
    handleAddReview,
    loading: addReviewLoading,
    error: addReviewError,
    placeData: allPlacesData?.places.find((place) => place.properties.id === placeId),
  };
}