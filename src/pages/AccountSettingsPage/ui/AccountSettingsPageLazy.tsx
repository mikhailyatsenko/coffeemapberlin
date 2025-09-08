import { lazy } from 'react';

export const AccountSettingsPageLazy = lazy(async () => {
  const module = await import('./AccountSettingsPage');
  return { default: module.AccountSettingsPage };
});
