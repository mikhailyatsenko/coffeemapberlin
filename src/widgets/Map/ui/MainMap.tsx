import 'mapbox-gl/dist/mapbox-gl.css';
import { type MainMapProps } from 'widgets/Map/types';
import { LoadMap } from 'features/LoadMap';

export const MainMap = ({ placesGeo }: MainMapProps) => {
  return (
    <div style={{ width: '100dvw', height: 'calc(100dvh - 60px)', zIndex: 1 }}>
      <LoadMap placesGeo={placesGeo} />
    </div>
  );
};
