import { type PlaceReviewsQuery } from 'shared/generated/graphql';

export const mapPlaceReviews = (data: PlaceReviewsQuery) => ({
  ...data,
  placeReviews: {
    ...data?.placeReviews,
    reviews: data?.placeReviews.reviews.map((review) => ({
      ...review,
      userAvatar: review.userAvatar ?? undefined,
      text: review.text ?? undefined,
      userRating: review.userRating ?? undefined,
    })),
  },
});
