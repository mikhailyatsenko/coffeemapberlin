import { useQuery } from '@apollo/client';
import { PlaceReviewsDocument, type PlaceReviewsQuery } from 'shared/generated/graphql';
import { mapPlaceReviews } from '../mappers';

export const usePlaceReviews = (placeId: string | null) => {
  const { data, error, loading } = useQuery<PlaceReviewsQuery>(PlaceReviewsDocument, {
    variables: { placeId, skip: !placeId },
  });

  if (!data) {
    return { data: undefined, error, loading };
  }

  return { data: mapPlaceReviews(data), error, loading };
};
