import { useEffect, useMemo } from 'react';
import { Outlet, useSearchParams } from 'react-router-dom';
import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';
import { useGetAllPlacesQuery } from 'shared/generated/graphql';
import { useEmailConfirmation } from 'shared/hooks/useEmailConfirmation';
import { usePlacesStore, setPlaces } from 'shared/stores/places';
import { PageSkeleton } from '../components/PageSkeleton/ui';

export const MainPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEmailConfirmation(email, token);

  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const places = usePlacesStore((state) => state.places);

  const { data, loading } = useGetAllPlacesQuery({
    // fetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (data) {
      setPlaces(data.places);
    }
  }, [data]);

  const favoritePlaces = useMemo(() => {
    return places.filter((place) => place.properties.isFavorite);
  }, [places]);

  const placesToDisplay = useMemo(() => {
    if (showFavorites && favoritePlaces.length) {
      return favoritePlaces;
    }

    return filteredPlaces?.length ? filteredPlaces : places;
  }, [showFavorites, places, filteredPlaces, favoritePlaces]);

  if (loading) {
    return <PageSkeleton />;
  }

  // This is a feature collection of places to properly display on the map
  const placesGeo = {
    type: 'FeatureCollection' as const,
    features: placesToDisplay ?? [],
  };

  return (
    <>
      <MainMap placesGeo={placesGeo} />
      <PlacesList places={placesToDisplay} isReady={!loading} />
      <ShowFavoritePlaces showFavorites={showFavorites} favoritesQuantity={favoritePlaces.length} />
      <Outlet />
    </>
  );
};
