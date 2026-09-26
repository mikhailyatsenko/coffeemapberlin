import { useMemo, useState } from 'react';
import { RegularButton } from 'shared/ui/RegularButton';
import { sortPlaces } from '../../../lib/sortPlaces';
import { type NeighborhoodPlace } from '../../../types';
import { PlacesSection } from '../../PlacesSection';
import { ALL_PLACES_PAGE_SIZE } from '../constants';
import cls from './AllPlaces.module.scss';

interface AllPlacesProps {
  neighborhood: string;
  places: readonly NeighborhoodPlace[];
  total: number;
  onCardOpen: () => void;
}

/** Every Place of the Neighborhood, best Average rating first, 20 at a time. */
export const AllPlaces = ({ neighborhood, places, total, onCardOpen }: AllPlacesProps) => {
  const [visibleCount, setVisibleCount] = useState(ALL_PLACES_PAGE_SIZE);
  const sortedPlaces = useMemo(() => sortPlaces(places), [places]);

  return (
    <PlacesSection
      id="all-places"
      title={`All ${total} Places in ${neighborhood}`}
      places={sortedPlaces.slice(0, visibleCount)}
      onCardOpen={onCardOpen}
    >
      {visibleCount < sortedPlaces.length && (
        <div className={cls.showMore}>
          <RegularButton
            onClick={() => {
              setVisibleCount((count) => count + ALL_PLACES_PAGE_SIZE);
            }}
          >
            Show {ALL_PLACES_PAGE_SIZE} more
          </RegularButton>
        </div>
      )}
    </PlacesSection>
  );
};
