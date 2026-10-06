import { useCallback, useEffect, useRef } from 'react';
import { type ShortlistId } from 'shared/generated/graphql';
import { trackEvent } from 'shared/lib/analytics';
import { useAuthStore } from 'shared/stores/auth';
import { type NeighborhoodSection } from '../types';

interface NeighborhoodAnalyticsOptions {
  slug: string | undefined;
  neighborhood: string;
  shortlistsShown: number;
  placesTotal: number;
  isLoaded: boolean;
}

/**
 * Sends `neighborhood_view` once per page view, when the data has loaded, and
 * gives the sections callbacks for `shortlist_view`, `shortlist_map_click` and
 * `neighborhood_card_click`.
 */
export const useNeighborhoodAnalytics = ({
  slug,
  neighborhood,
  shortlistsShown,
  placesTotal,
  isLoaded,
}: NeighborhoodAnalyticsOptions) => {
  const actor = useAuthStore((s) => (s.user ? 'user' : 'guest'));
  const viewTrackedForRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded || viewTrackedForRef.current === slug) return;
    viewTrackedForRef.current = slug;
    trackEvent('neighborhood_view', {
      neighborhood,
      shortlists_shown: shortlistsShown,
      places_total: placesTotal,
      actor,
    });
  }, [isLoaded, slug, neighborhood, shortlistsShown, placesTotal, actor]);

  const trackShortlistView = useCallback(
    (shortlist: ShortlistId) => {
      trackEvent('shortlist_view', { neighborhood, shortlist, actor });
    },
    [neighborhood, actor],
  );

  const trackShortlistMapOpen = useCallback(
    (shortlist: Exclude<NeighborhoodSection, 'all'>, count: number) => {
      trackEvent('shortlist_map_click', { neighborhood, shortlist, count, actor });
    },
    [neighborhood, actor],
  );

  const trackCardOpen = useCallback(
    (section: NeighborhoodSection) => {
      trackEvent('neighborhood_card_click', { neighborhood, section, actor });
    },
    [neighborhood, actor],
  );

  return { trackShortlistView, trackShortlistMapOpen, trackCardOpen };
};
