import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect } from 'react';
import { LoadMap } from 'features/LoadMap';
import { type PlacesDataWithGeo } from 'features/LoadMap/types';
import { usePlaces } from 'shared/context/PlacesData/usePlaces';
import { useGetAllPlacesQuery } from 'shared/generated/graphql';
import { setPlaces, usePlacesStore } from 'shared/stores/places';
import { Loader } from 'shared/ui/Loader';

export const MainMap = () => {
  const { favoritePlaces, showFavorites } = usePlaces();

  const { data, loading } = useGetAllPlacesQuery();

  useEffect(() => {
    if (data) {
      setPlaces(data.places);
    }
  }, [data]);

  const places = usePlacesStore((state) => state.places);

  const placesGeo = {
    type: 'FeatureCollection' as const,
    features: (showFavorites && favoritePlaces?.length ? favoritePlaces : places) || [],
  };

  return (
    <>
      {loading ? <Loader /> : null}
      <div style={{ width: '100dvw', height: 'calc(100dvh - 60px)', zIndex: 1 }}>
        {placesGeo && <LoadMap placesGeo={placesGeo as PlacesDataWithGeo} />}
      </div>
    </>
  );
};
