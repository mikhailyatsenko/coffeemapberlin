import { lazy } from 'react';

export const SuggestPlacePageLazy = lazy(async () => {
  const module = await import('./SuggestPlacePage');
  return { default: module.SuggestPlacePage };
});
