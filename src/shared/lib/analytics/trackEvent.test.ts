import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { trackEvent } from './trackEvent';

describe('trackEvent', () => {
  const gtag = vi.fn();

  beforeEach(() => {
    window.gtag = gtag;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    gtag.mockReset();
  });

  it('sends the event with its params through gtag in production', () => {
    vi.stubEnv('VITE_ENV', 'production');

    trackEvent('rating_saved', { place_id: 'p1', rating: 4 });

    expect(gtag).toHaveBeenCalledExactlyOnceWith('event', 'rating_saved', { place_id: 'p1', rating: 4 });
  });

  it('sends nothing outside production', () => {
    vi.stubEnv('VITE_ENV', 'development');

    trackEvent('rating_saved', { place_id: 'p1' });

    expect(gtag).not.toHaveBeenCalled();
  });
});
