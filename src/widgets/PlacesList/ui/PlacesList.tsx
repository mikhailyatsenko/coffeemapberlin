import { memo } from 'react';
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
      {/* Always render SEO content for search engines */}
      <SEOPlacesList places={places} />

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
