import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';
import { useGetPlacesLazyQuery, useGetPlacesQuery } from 'shared/generated/graphql';
import { useEmailConfirmation } from 'shared/hooks/useEmailConfirmation';
import { useAuthStore } from 'shared/stores/auth';
import {
  setLoadingState,
  setPlaces,
  usePlacesStore,
  startLoading,
  finishLoading,
  revalidatePlaces,
  PAGE_SIZE,
  INITIAL_OFFSET,
} from 'shared/stores/places';

export const MainPage = () => {
  const location = useLocation();
  const places = usePlacesStore((state) => state.places);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const hasInitialData = usePlacesStore((state) => state.hasInitialData);
  const { user, isAuthLoading } = useAuthStore();

  // Handle email confirmation from location state
  const token = location.state?.token as string | null | undefined;
  const email = location.state?.email as string | null | undefined;
  useEmailConfirmation(email, token);

  // Load initial 10 places data when the main page mounts
  const { data: initialData, loading: initialLoading } = useGetPlacesQuery({
    variables: { limit: PAGE_SIZE, offset: INITIAL_OFFSET },
    fetchPolicy: 'cache-first',
  });

  const [fetchMore, { loading: moreDataLoading }] = useGetPlacesLazyQuery();

  // Handle initial data loading
  useEffect(() => {
    if (!initialData?.places || hasInitialData) return;

    const initialPlaces = initialData.places.places ?? [];
    setPlaces(initialPlaces);
    finishLoading();

    // Load additional data if needed
    const totalPlaces = initialData.places.total;
    if (totalPlaces > PAGE_SIZE) {
      startLoading();

      fetchMore({
        variables: {
          limit: totalPlaces - PAGE_SIZE,
          offset: PAGE_SIZE,
        },
      })
        .then((result) => {
          if (result.data?.places?.places?.length) {
            const additionalPlaces = result.data.places.places;
            setPlaces((prev) => [...prev, ...additionalPlaces]);
          }
          finishLoading();
        })
        .catch(() => {
          finishLoading();
        });
    }
  }, [initialData?.places, fetchMore, hasInitialData]);

  // Update loading state based on GraphQL loading states
  useEffect(() => {
    setLoadingState({ isLoading: initialLoading || moreDataLoading });
  }, [initialLoading, moreDataLoading]);

  // Revalidate places when auth state changes
  useEffect(() => {
    if (!isAuthLoading) {
      // If user logged in/out, revalidate places to get fresh data
      revalidatePlaces();
    }
  }, [user, isAuthLoading]);

  const favoritePlaces = useMemo(() => {
    return places.filter((place) => place.properties.isFavorite);
  }, [places]);

  const placesToDisplay = useMemo(() => {
    if (showFavorites) return favoritePlaces;
    return filteredPlaces?.length ? filteredPlaces : places;
  }, [showFavorites, filteredPlaces, places, favoritePlaces]);

  const placesGeo = {
    type: 'FeatureCollection' as const,
    features: placesToDisplay ?? [],
  };

  return (
    <>
      <PlacesList places={placesToDisplay} />
      <MainMap placesGeo={placesGeo} />
      <ShowFavoritePlaces showFavorites={showFavorites} favoritesQuantity={favoritePlaces.length} />
    </>
  );
};
