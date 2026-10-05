import { useEffect, useMemo, useState } from 'react';
import { useFilteredPlacesCountQuery } from 'shared/generated/graphql';
import { toFilteredPlacesVariables, useFiltersStore } from 'shared/stores/filters';
import { type ResultCount } from '../types/resultCount';

const DEBOUNCE_MS = 300;

/**
 * Counts the Places the current Filters match, with the same variables "Apply Filters" fetches.
 * Asks at once when the modal opens, then 300 ms after the last change.
 */
export const useResultCount = (): ResultCount => {
  const isOpen = useFiltersStore((state) => state.isFilterPanelOpen);
  const minRating = useFiltersStore((state) => state.minRating);
  const neighborhood = useFiltersStore((state) => state.neighborhood);
  const selectedTags = useFiltersStore((state) => state.selectedTags);

  const variables = useMemo(
    () => toFilteredPlacesVariables({ minRating, neighborhood, selectedTags }),
    [minRating, neighborhood, selectedTags],
  );
  const [debouncedVariables, setDebouncedVariables] = useState(variables);
  const [lastTotal, setLastTotal] = useState<number | null>(null);

  // On open: count the current Filters at once, and forget the count from the last time the modal was open
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setDebouncedVariables(variables);
      setLastTotal(null);
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    const timeout = setTimeout(() => {
      setDebouncedVariables(variables);
    }, DEBOUNCE_MS);
    return () => {
      clearTimeout(timeout);
    };
  }, [isOpen, variables]);

  // No cache: a total-only result in the shared cache would overwrite the Places MainPage reads from it
  const { data, loading, error } = useFilteredPlacesCountQuery({
    skip: !isOpen,
    variables: debouncedVariables,
    fetchPolicy: 'no-cache',
  });

  // Only a settled request counts: on reopen, Apollo hands back the last open's data while it asks again
  const total = loading ? undefined : data?.filteredPlaces.total;
  if (isOpen && total !== undefined && total !== lastTotal) {
    setLastTotal(total);
  }
  // A failed count leaves no total behind, so the next change reads "Counting places…", not a stale number
  const hasFailed = Boolean(error) && !loading && variables === debouncedVariables;
  if (hasFailed && lastTotal !== null) {
    setLastTotal(null);
  }

  if (hasFailed) return { status: 'unavailable' };
  if (lastTotal === null) return { status: 'counting' };
  return { status: 'ready', total: lastTotal, isUpdating: loading || variables !== debouncedVariables };
};
