import { type MainMapProps } from 'widgets/Map/types';
import { LoadMap } from 'features/LoadMap';

export const MainMap = ({ placesGeo }: MainMapProps) => {
  return (
    <div style={{ width: '100dvw', height: 'calc(100dvh - 60px)', overflow: 'hidden' }}>
      <LoadMap placesGeo={placesGeo} />
    </div>
  );
};
