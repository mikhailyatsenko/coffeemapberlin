import { useEffect, useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { MainMap } from 'widgets/Map';
import { PlacesList } from 'widgets/PlacesList';
import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';
import { useGetAllPlacesQuery } from 'shared/generated/graphql';
import { usePlacesStore, setPlaces } from 'shared/stores/places';
import { Loader } from 'shared/ui/Loader';

export const MainPage = () => {
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const showFavorites = usePlacesStore((state) => state.showFavorites);
  const places = usePlacesStore((state) => state.places);

  const { data, loading } = useGetAllPlacesQuery();

  useEffect(() => {
    if (data) {
      setPlaces(data.places);
    }
  }, [data]);

  const favoritePlaces = useMemo(() => {
    return places.filter((place) => place.properties.isFavorite);
  }, [places]);

  const placesToDisplay = useMemo(() => {
    if (showFavorites) {
      return favoritePlaces;
    }

    return filteredPlaces?.length ? filteredPlaces : places;
  }, [showFavorites, places, filteredPlaces, favoritePlaces]);

  // This is a feature collection of places to properly display on the map using mapbox
  const placesGeo = {
    type: 'FeatureCollection' as const,
    features: placesToDisplay ?? [],
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <MainMap placesGeo={placesGeo} />
      <PlacesList places={placesToDisplay} />
      <ShowFavoritePlaces showFavorites={showFavorites} favoritesQuantity={favoritePlaces.length} />
      <Outlet />
    </>
  );
};
