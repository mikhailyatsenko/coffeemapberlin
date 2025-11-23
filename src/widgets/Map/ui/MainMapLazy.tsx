import { lazy } from 'react';

export const MainMapLazy = lazy(async () => {
  const module = await import('./MainMap');
  return { default: module.MainMap };
});
