import { memo, Suspense } from 'react';
import { usePlacesStore } from 'shared/stores/places';
import { ContainerSizeManager } from '../components/ContainerSizeManager';
import { SEOPlacesList } from '../components/SEOPlacesList';
import { VirtualizedList } from '../components/VirtualizedList';
import { type PlacesListProps } from '../types';
import cls from './PlacesList.module.scss';

const PlacesListComponent = ({ places }: PlacesListProps) => {
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);

  if (filteredPlaces) {
    return null;
  }

  return (
    <div className={cls.placesListWrapper}>
      {/* Lazy loaded SEO content for search engines */}
      <Suspense fallback={null}>
        <SEOPlacesList places={places} />
      </Suspense>

      {/* Virtualized version for users */}
      <div className={cls.PlacesList}>
        <ContainerSizeManager>
          {(size) => <VirtualizedList places={places} containerSize={size} />}
        </ContainerSizeManager>
      </div>
    </div>
  );
};

export const PlacesList = memo(
  PlacesListComponent,
  (prev, next) => prev.places === next.places && prev.isReady === next.isReady,
);
