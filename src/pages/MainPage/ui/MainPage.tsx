import { useCallback, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';
import { useGetPlacesQuery } from 'shared/generated/graphql';
import { useEmailConfirmation } from 'shared/hooks/useEmailConfirmation';
import { useAuthStore } from 'shared/stores/auth';
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
      const merged = [...prev];
      console.log('MERGING');
      incomingPlaces.forEach((place) => {
        if (!existingIds.has(place.id)) {
          existingIds.add(place.id);
          if (isInitial) {
            merged.unshift(place);
          } else {
            merged.push(place);
          }
        }
      });

      return merged;
    });
  }, []);

  const { loading: initialLoading } = useGetPlacesQuery({
    skip: hasInitialBatchLoaded,
    variables: { limit: PAGE_SIZE, offset: INITIAL_OFFSET },
    onCompleted: (data) => {
      appendUniquePlaces(data?.places.places);
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
    return filteredPlaces?.length ? filteredPlaces : places;
  }, [showFavorites, filteredPlaces, places, user, favoritePlaces, guestFavIds]);

  const placesGeo = {
    type: 'FeatureCollection' as const,
    features: placesToDisplay ?? [],
  };

  return (
    <>
      <main>
        {initialLoading && <Loader />}
        <PlacesList places={placesToDisplay} />
        <MainMap placesGeo={placesGeo} />
      </main>
      <ShowFavoritePlaces
        showFavorites={showFavorites}
        favoritesQuantity={favoritePlaces.length || (!user ? guestFavIds.length : 0)}
      />
    </>
  );
};
