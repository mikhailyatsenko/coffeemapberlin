import { lazy } from 'react';

export const PlacePageLazy = lazy(async () => await import('./PlacePage'));
