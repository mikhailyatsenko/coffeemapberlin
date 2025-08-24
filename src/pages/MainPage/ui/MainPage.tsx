import { useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';
import { useGetPlacesQuery, useGetPlacesLazyQuery } from 'shared/generated/graphql';
import { useEmailConfirmation } from 'shared/hooks/useEmailConfirmation';
import { usePlacesStore, setPlaces } from 'shared/stores/places';
import { PageSkeleton } from '../components/PageSkeleton/ui';

const PAGE_SIZE = 10;

export const MainPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEmailConfirmation(email, token);

  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const places = usePlacesStore((state) => state.places);

  // Начальный запрос: первые 10 мест
  const { data: initialData, loading: initialLoading } = useGetPlacesQuery({
    variables: { limit: PAGE_SIZE, offset: 0 },
    fetchPolicy: 'cache-first',
  });

  // Ленивый запрос для подгрузки остальных
  const [fetchMore, { data: moreData, loading: moreLoading }] = useGetPlacesLazyQuery();

  // Используем useRef для отслеживания, были ли данные уже загружены
  const hasFetchedMore = useRef(false);

  useEffect(() => {
    if (initialData?.places?.places && !places.length) {
      setPlaces(initialData.places.places);
      if (initialData.places.total > PAGE_SIZE && !hasFetchedMore.current) {
        console.log('Fetching more, total:', initialData.places.total);
        fetchMore({
          variables: {
            limit: initialData.places.total - PAGE_SIZE,
            offset: PAGE_SIZE,
          },
        });
      }
    }
    // TODO: clarify this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    if (moreData?.places?.places) {
      console.log('Appending more places:', moreData.places.places.length);
      setPlaces([...places, ...moreData.places.places]);
    }
    // TODO: clarify this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moreData]);

  const favoritePlaces = useMemo(() => {
    return places.filter((place) => place.properties.isFavorite);
  }, [places]);

  const placesToDisplay = useMemo(() => {
    if (showFavorites && favoritePlaces.length) {
      return favoritePlaces;
    }
    return filteredPlaces?.length ? filteredPlaces : places;
  }, [showFavorites, places, filteredPlaces, favoritePlaces]);

  if (initialLoading) {
    return <PageSkeleton />;
  }

  const placesGeo = {
    type: 'FeatureCollection' as const,
    features: placesToDisplay ?? [],
  };

  return (
    <>
      <MainMap placesGeo={placesGeo} />
      <PlacesList places={placesToDisplay} isReady={!initialLoading && !moreLoading} />
      <ShowFavoritePlaces showFavorites={showFavorites} favoritesQuantity={favoritePlaces.length} />
    </>
  );
};
