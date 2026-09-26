import { useCallback, useEffect, useMemo, useRef } from 'react';
import { trackEvent } from 'shared/lib/analytics';
import { useAuthStore } from 'shared/stores/auth';
import { type NeighborhoodSection } from '../types';

interface NeighborhoodAnalyticsOptions {
  slug: string | undefined;
  neighborhood: string;
  placesTotal: number;
  isLoaded: boolean;
}

/**
 * Sends `neighborhood_view` once per page view, when the data has loaded, and
 * gives each section a stable callback for `neighborhood_card_click`.
 */
export const useNeighborhoodAnalytics = ({
  slug,
  neighborhood,
  placesTotal,
  isLoaded,
}: NeighborhoodAnalyticsOptions) => {
  const actor = useAuthStore((s) => (s.user ? 'user' : 'guest'));
  const viewTrackedForRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded || viewTrackedForRef.current === slug) return;
    viewTrackedForRef.current = slug;
    trackEvent('neighborhood_view', { neighborhood, shortlists_shown: 0, places_total: placesTotal, actor });
  }, [isLoaded, slug, neighborhood, placesTotal, actor]);

  const trackCardOpen = useCallback(
    (section: NeighborhoodSection) => {
      trackEvent('neighborhood_card_click', { neighborhood, section, actor });
    },
    [neighborhood, actor],
  );

  return useMemo(
    () => ({
      trackTopRatedCardOpen: () => {
        trackCardOpen('top_rated');
      },
      trackAllCardOpen: () => {
        trackCardOpen('all');
      },
    }),
    [trackCardOpen],
  );
};
