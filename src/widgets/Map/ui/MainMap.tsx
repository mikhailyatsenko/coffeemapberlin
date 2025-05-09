import 'mapbox-gl/dist/mapbox-gl.css';
import { LoadMap } from 'features/LoadMap';
import { type PlacesDataWithGeo } from 'features/LoadMap/types';
import { usePlaces } from 'shared/context/PlacesData/usePlaces';
import { Loader } from 'shared/ui/Loader';

export const MainMap = () => {
  const { filterablePlaces, favoritePlaces, showFavorites, loading } = usePlaces();

  if (loading) {
    return <Loader />;
  }

  if (!filterablePlaces) return null;

  const placesGeo = {
    type: 'FeatureCollection' as const,
    features: (showFavorites && favoritePlaces?.length ? favoritePlaces : filterablePlaces) || [],
  };

  return (
    <>
      <div style={{ width: '100dvw', height: 'calc(100dvh - 60px)', zIndex: 1 }}>
        {placesGeo && <LoadMap placesGeo={placesGeo as PlacesDataWithGeo} />}
      </div>
    </>
  );
};
