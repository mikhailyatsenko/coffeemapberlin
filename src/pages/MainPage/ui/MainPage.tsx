import { useEffect, useMemo } from 'react';
// import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';
import { useGetPlacesQuery, useGetPlacesLazyQuery } from 'shared/generated/graphql';

// import { useAuthStore } from 'shared/stores/auth';
import { usePlacesStore, setPlaces } from 'shared/stores/places';
import { PageSkeleton } from '../components/PageSkeleton/ui';

const PAGE_SIZE = 10;

export const MainPage = () => {
  // const { user } = useAuthStore();
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const places = usePlacesStore((state) => state.places);

  const { data: initialData, loading: initialLoading } = useGetPlacesQuery({
    variables: { limit: PAGE_SIZE, offset: 0 },
    fetchPolicy: 'cache-first',
  });

  const [fetchMore, { data: moreData }] = useGetPlacesLazyQuery();

  // Initial fetch
  useEffect(() => {
    if (!initialData?.places) return;

    setPlaces(initialData.places.places ?? []);

    if (initialData.places.total > PAGE_SIZE) {
      fetchMore({
        variables: { limit: initialData.places.total - PAGE_SIZE, offset: PAGE_SIZE },
      });
    }
  }, [initialData, fetchMore]);

  // Lazy fetch — добавляем новые места к уже существующим
  useEffect(() => {
    if (!moreData?.places?.places?.length) return;
    setPlaces((prev) => [...prev, ...moreData.places.places]);
  }, [moreData]);

  const favoritePlaces = useMemo(() => {
    return places.filter((place) => place.properties.isFavorite);
  }, [places]);

  const placesToDisplay = useMemo(() => {
    if (showFavorites && favoritePlaces.length) return favoritePlaces;
    return filteredPlaces?.length ? filteredPlaces : places;
  }, [showFavorites, filteredPlaces, places, favoritePlaces]);

  if (initialLoading) return <PageSkeleton />;

  // const placesGeo = {
  //   type: 'FeatureCollection' as const,
  //   features: placesToDisplay ?? [],
  // };

  // const isShowSkeleton = initialLoading || moreLoading;

  return (
    <>
      <PageSkeleton />
      <PlacesList places={placesToDisplay} isReady={!initialLoading} />
      <ShowFavoritePlaces showFavorites={showFavorites} favoritesQuantity={favoritePlaces.length} />
    </>
  );
};
