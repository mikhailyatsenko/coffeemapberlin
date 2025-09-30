import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { PlaceReviewsDocument, type PlaceReviewsQuery } from 'shared/generated/graphql';
import { mapPlaceReviews } from '../mappers';

export const usePlaceReviews = (placeId: string | null) => {
  const { data, error, loading } = useQuery<PlaceReviewsQuery>(PlaceReviewsDocument, {
    variables: { placeId },
    skip: !placeId,
  });

  // avoid recreating reviews on every parent re-render
  // for proper memo ReviewList component
  const mappedData = useMemo(() => {
    if (!data) return undefined;
    if (!placeId) return undefined;
    return mapPlaceReviews(data, placeId);
  }, [data, placeId]);

  return { data: mappedData, error, loading };
};
