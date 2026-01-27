import { useCallback, useMemo, Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import { FloatingButtons } from 'widgets/FloatingButtons';
import { MainMapLazy } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { FilterPanel } from 'features/FilterPanel';
import { EmptyFilterResults } from 'features/FilterPanel/components/EmptyFilterResults';
import { useGetPlacesQuery, useFilteredPlacesLazyQuery } from 'shared/generated/graphql';
import { useEmailConfirmation } from 'shared/hooks/useEmailConfirmation';
import { useAuthStore } from 'shared/stores/auth';
import { useFiltersStore } from 'shared/stores/filters';
import { useGuestFavoritesStore } from 'shared/stores/guestFavorites';

import {
  setPlaces,
  usePlacesStore,
  PAGE_SIZE,
  INITIAL_OFFSET,
  setShowFavorites,
  setInitialBatchLoaded,
  setMoreBatchLoaded,
  type Place,
} from 'shared/stores/places';
import { Loader } from 'shared/ui/Loader';

export const MainPage = () => {
  const location = useLocation();
  const places = usePlacesStore((state) => state.places);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const hasInitialBatchLoaded = usePlacesStore((state) => state.hasInitialBatchLoaded);
  const hasMoreBatchLoaded = usePlacesStore((state) => state.hasMoreBatchLoaded);
  const { user } = useAuthStore();
  const guestFavIds = useGuestFavoritesStore((s) => s.ids);

  // Use separate selectors to avoid creating new objects on each render
  const minRating = useFiltersStore((state) => state.minRating);
  const neighborhood = useFiltersStore((state) => state.neighborhood);
  const selectedTags = useFiltersStore((state) => state.selectedTags);

  // Check if filters are active
  const hasActiveFilters = useMemo(
    () => minRating > 0 || neighborhood.length > 0 || selectedTags.length > 0,
    [minRating, neighborhood, selectedTags],
  );

  // Handle email confirmation from location state
  const token = location.state?.token as string | null | undefined;
  const email = location.state?.email as string | null | undefined;
  useEmailConfirmation(email, token);

  // Indicate loading only for initial data loading. More data is loading in the background.
  const appendUniquePlaces = useCallback((incomingPlaces?: Place[] | null, isInitial?: boolean) => {
    if (!incomingPlaces?.length) {
      return;
    }
    setPlaces((prev) => {
      if (!prev.length) {
        return incomingPlaces;
      }

      const existingIds = new Set(prev.map((place) => place.id));
      const newPlaces = incomingPlaces.filter((place) => {
        if (!existingIds.has(place.id)) {
          existingIds.add(place.id);
          return true;
        }
        return false;
      });

      return isInitial ? [...newPlaces, ...prev] : [...prev, ...newPlaces];
    });
  }, []);

  const { loading: initialLoading } = useGetPlacesQuery({
    skip: hasInitialBatchLoaded,
    variables: { limit: PAGE_SIZE, offset: INITIAL_OFFSET },
    onCompleted: (data) => {
      appendUniquePlaces(data?.places.places, true);
      setInitialBatchLoaded(true);
    },
  });

  useGetPlacesQuery({
    skip: hasMoreBatchLoaded,
    variables: { offset: PAGE_SIZE },
    onCompleted: (data) => {
      appendUniquePlaces(data?.places.places);
      setMoreBatchLoaded(true);
    },
  });

  // Filtered places query - using lazy query to control when it executes
  const [fetchFilteredPlaces, { loading: filteredLoading }] = useFilteredPlacesLazyQuery({
    onCompleted: (data) => {
      // Always set filteredPlaces, even if empty array, to distinguish from "no filters applied"
      usePlacesStore.setState({ filteredPlaces: data?.filteredPlaces.places || [] });
    },
  });

  const handleApplyFilters = useCallback(() => {
    if (hasActiveFilters) {
      fetchFilteredPlaces({
        variables: {
          minRating: minRating > 0 ? minRating : undefined,
          neighborhood: neighborhood.length > 0 ? neighborhood : undefined,
          additionalInfo: selectedTags.length > 0 ? selectedTags : undefined,
        },
      });
    } else {
      // Clear filtered places if no active filters
      usePlacesStore.setState({ filteredPlaces: null });
    }
  }, [hasActiveFilters, minRating, neighborhood, selectedTags, fetchFilteredPlaces]);

  const handleResetFilters = useCallback(() => {
    // Clear filtered places when filters are reset
    usePlacesStore.setState({ filteredPlaces: null });
  }, []);

  const favoritePlaces = useMemo(() => {
    return places.filter((place) => place.properties.isFavorite);
  }, [places]);

  const placesToDisplay = useMemo(() => {
    if (showFavorites) {
      if (!user && guestFavIds.length) {
        const favIdsSet = new Set(guestFavIds);
        return places.filter((obj) => favIdsSet.has(obj.id));
      }
      if (favoritePlaces.length) {
        return favoritePlaces;
      }
      setShowFavorites(false);
    }
    // If filters are active and filteredPlaces is an empty array, return empty array
    // If filters are active and filteredPlaces has items, return filteredPlaces
    // If no filters are active (filteredPlaces is null), return all places
    if (hasActiveFilters && filteredPlaces !== null) {
      return filteredPlaces || [];
    }
    return places;
  }, [showFavorites, filteredPlaces, places, user, favoritePlaces, guestFavIds, hasActiveFilters]);

  // Check if we should show empty results message
  const showEmptyResults = hasActiveFilters && filteredPlaces !== null && filteredPlaces.length === 0;

  const placesGeo = {
    type: 'FeatureCollection' as const,
    features: showEmptyResults ? [] : placesToDisplay ?? [],
  };

  return (
    <>
      <main>
        {(initialLoading || filteredLoading) && <Loader />}
        {showEmptyResults ? (
          <EmptyFilterResults onResetFilters={handleResetFilters} />
        ) : (
          <PlacesList places={placesToDisplay} />
        )}
        <Suspense fallback={null}>
          <MainMapLazy placesGeo={placesGeo} />
        </Suspense>
      </main>
      <FloatingButtons
        showFavorites={showFavorites}
        favoritesQuantity={favoritePlaces.length || (!user ? guestFavIds.length : 0)}
        hasActiveFilters={hasActiveFilters && filteredPlaces !== null}
      />
      <FilterPanel
        hasActiveFilters={hasActiveFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </>
  );
};
