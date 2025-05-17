import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useMemo } from 'react';
import { LoadMap } from 'features/LoadMap';
import { type PlacesDataWithGeo } from 'features/LoadMap/types';

import { ShowFavoritePlaces } from 'features/ShowFavoritePlaces';
import { useGetAllPlacesQuery } from 'shared/generated/graphql';
import { setPlaces, usePlacesStore } from 'shared/stores/places';
import { Loader } from 'shared/ui/Loader';

export const MainMap = () => {
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
      <div style={{ width: '100dvw', height: 'calc(100dvh - 60px)', zIndex: 1 }}>
        {placesGeo && <LoadMap placesGeo={placesGeo as PlacesDataWithGeo} />}
      </div>
      <ShowFavoritePlaces showFavorites={showFavorites} favoritesQuantity={favoritePlaces.length} />
    </>
  );
};
