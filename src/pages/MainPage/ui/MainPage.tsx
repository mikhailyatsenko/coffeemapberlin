import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';
import { useGetPlacesLazyQuery, useGetPlacesQuery } from 'shared/generated/graphql';
import { useEmailConfirmation } from 'shared/hooks/useEmailConfirmation';
import { setLoadingState, setPlaces, usePlacesStore, PAGE_SIZE, INITIAL_OFFSET } from 'shared/stores/places';

export const MainPage = () => {
  const location = useLocation();
  const places = usePlacesStore((state) => state.places);
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const showFavorites = usePlacesStore((state) => state.showFavorites);

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

  // Handle initial and additional data
  useEffect(() => {
    const state = usePlacesStore.getState();

    if (state.fetchMoreInProgress) return;

    if (!initialData?.places || state.isInitialLoadComplete) return;

    const initialPlaces = initialData.places.places ?? [];
    setPlaces(initialPlaces);
    setLoadingState({ isInitialLoadComplete: true });

    const totalPlaces = initialData.places.total;
    if (totalPlaces > PAGE_SIZE && !state.fetchMoreInProgress) {
      setLoadingState({ fetchMoreInProgress: true });

      fetchMore({
        variables: {
          limit: totalPlaces - PAGE_SIZE,
          offset: PAGE_SIZE,
        },
      })
        .then((result) => {
          if (result.data?.places?.places?.length) {
            const additionalPlaces = result.data.places.places;

            setPlaces((prev) => {
              if (prev.length > PAGE_SIZE) {
                return prev;
              }
              return [...prev, ...additionalPlaces];
            });

            setLoadingState({
              isMoreDataLoaded: true,
              fetchMoreInProgress: false,
            });
          } else {
            setLoadingState({ fetchMoreInProgress: false });
          }
        })
        .catch(() => {
          setLoadingState({ fetchMoreInProgress: false });
        });
    }
  }, [initialData?.places, fetchMore]);

  // Update loading flags in store
  useEffect(() => {
    setLoadingState({
      isInitialLoading: initialLoading,
      isMoreDataLoading: moreDataLoading,
    });
  }, [initialLoading, moreDataLoading]);

  const favoritePlaces = useMemo(() => {
    return places.filter((place) => place.properties.isFavorite);
  }, [places]);

  const placesToDisplay = useMemo(() => {
    if (showFavorites && favoritePlaces.length) return favoritePlaces;
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
