import { lazy } from 'react';

export const SuggestionReviewPageLazy = lazy(async () => {
  const module = await import('./SuggestionReviewPage');
  return { default: module.SuggestionReviewPage };
});
