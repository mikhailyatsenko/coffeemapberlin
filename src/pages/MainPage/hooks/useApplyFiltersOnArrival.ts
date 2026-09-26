import { useEffect, useRef } from 'react';

/**
 * Applies the Filters the map opens with, e.g. set by a Shortlist's "See all on
 * the map", without waiting for the panel's Apply. Runs once per mount.
 */
export const useApplyFiltersOnArrival = (applyFilters: () => void) => {
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;
    applyFilters();
  }, [applyFilters]);
};
