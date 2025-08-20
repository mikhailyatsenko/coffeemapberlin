import { type PlaceReviewsQuery } from 'shared/generated/graphql';

export const mapPlaceReviews = (data: PlaceReviewsQuery) => {
  const normalized = data?.placeReviews.reviews.map((review) => ({
    ...review,
    userAvatar: review.userAvatar ?? undefined,
    text: review.text ?? undefined,
    userRating: review.userRating ?? undefined,
  }));

  const ownReview = normalized.find((r) => r.isOwnReview);
  const othersSorted = normalized
    .filter((r) => !r.isOwnReview)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return {
    ...data,
    placeReviews: {
      ...data.placeReviews,
      ownReview,
      othersSorted,
    },
  };
};
