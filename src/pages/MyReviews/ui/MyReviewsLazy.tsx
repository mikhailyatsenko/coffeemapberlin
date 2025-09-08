import { lazy } from 'react';

export const MyReviewsLazy = lazy(async () => {
  const module = await import('./MyReviews');
  return { default: module.MyReviews };
});
