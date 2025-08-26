import { type MainMapProps } from 'widgets/Map/types';
import { LoadMap } from 'features/LoadMap';

export const MainMap = ({ placesGeo, moreDataLoading }: MainMapProps) => {
  return (
    <div style={{ width: '100dvw', height: 'calc(100dvh - 60px)', overflow: 'hidden' }}>
      <LoadMap moreDataLoading={moreDataLoading} placesGeo={placesGeo} />
    </div>
  );
};
