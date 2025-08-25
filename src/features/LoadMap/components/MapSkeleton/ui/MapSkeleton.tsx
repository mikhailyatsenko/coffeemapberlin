import cls from './MapSkeleton.module.scss';

const Map = () => (
  <div className={cls.mapSkeleton}>
    <div className={cls.loadingText}>Map is preparing...</div>
  </div>
);

export const MapSkeleton = () => (
  <div className={cls.mainPageSkeleton}>
    <div className={cls.mapContainer}>
      <Map />
    </div>
  </div>
);
