import clsx from 'clsx';
import { memo } from 'react';
import { useWidth } from 'shared/hooks';
import { usePlacesStore } from 'shared/stores/places';
import { ContainerSizeManager } from '../components/ContainerSizeManager';
import { VirtualizedList } from '../components/VirtualizedList';
import { MOBILE_BREAKPOINT } from '../constants';
import { type PlacesListProps } from '../types';
import cls from './PlacesList.module.scss';

const PlacesListComponent = ({ places }: PlacesListProps) => {
  const filteredPlaces = usePlacesStore((state) => state.filteredPlaces);
  const width = useWidth();
  const isMobile = width <= MOBILE_BREAKPOINT;

  if (filteredPlaces) {
    return null;
  }

  return (
    <div className={cls.placesListWrapper}>
      <div
        className={clsx(cls.PlacesList, {
          [cls.mobile]: isMobile,
          [cls.desktop]: !isMobile,
        })}
      >
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
