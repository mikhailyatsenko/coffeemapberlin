import { memo } from 'react';
import { useIsBot } from 'shared/hooks/useIsBot';
import { usePlacesStore } from 'shared/stores/places';
import { ContainerSizeManager } from '../components/ContainerSizeManager';
import { SEOPlacesList } from '../components/SEOPlacesList';
import { VirtualizedList } from '../components/VirtualizedList';
import { type PlacesListProps } from '../types';
import cls from './PlacesList.module.scss';

const PlacesListComponent = ({ places }: PlacesListProps) => {
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const isBot = useIsBot();

  if (filteredPlaces) {
    return null;
  }

  // For search engine bots, show SEO-friendly version without virtualization
  if (isBot) {
    return <SEOPlacesList places={places} />;
  }

  // For regular users, show virtualized version
  return (
    <div className={cls.placesListWrapper}>
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
