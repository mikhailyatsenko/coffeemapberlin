import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CardContribution } from 'features/RateNow';
import { NeighborhoodPlaceRow } from 'entities/NeighborhoodPlaceCard';
import { RoutePaths } from 'shared/constants';
import { RegularButton } from 'shared/ui/RegularButton';
import { sortPlaces } from '../../../lib/sortPlaces';
import { type NeighborhoodPlace } from '../../../types';
import { ALL_PLACES_PAGE_SIZE } from '../constants';
import cls from './AllPlaces.module.scss';

interface AllPlacesProps {
  neighborhood: string;
  places: readonly NeighborhoodPlace[];
  total: number;
  onCardOpen: () => void;
}

/** Every Place of the Neighborhood as rows where people rate, best Average rating first, 20 at a time. */
export const AllPlaces = ({ neighborhood, places, total, onCardOpen }: AllPlacesProps) => {
  const [visibleCount, setVisibleCount] = useState(ALL_PLACES_PAGE_SIZE);
  const sortedPlaces = useMemo(() => sortPlaces(places), [places]);

  return (
    <section id="all-places" className={cls.section} aria-labelledby="all-places-title">
      <h2 id="all-places-title" className={cls.title}>
        All {total} Place{total !== 1 ? 's' : ''} in {neighborhood}
      </h2>
      <ul className={cls.list}>
        {sortedPlaces.slice(0, visibleCount).map((place) => (
          <li key={place.id}>
            <NeighborhoodPlaceRow
              place={place}
              onOpen={onCardOpen}
              contribution={
                <CardContribution placeId={place.id} ownRating={place.properties.ownRating} section="all" />
              }
            />
          </li>
        ))}
      </ul>
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
      <p className={cls.suggest}>
        Know a Place that’s missing? <Link to={`/${RoutePaths.suggestPlace}`}>Suggest it</Link>
      </p>
    </section>
  );
};
