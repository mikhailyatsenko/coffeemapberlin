// import { type Review } from '../types';
import { type Review } from 'shared/generated/graphql';

export const sortReviews = (reviews: Review[]) => {
  return [...reviews].sort((a, b) => {
    if (a.isOwnReview) return -1;
    if (b.isOwnReview) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};
