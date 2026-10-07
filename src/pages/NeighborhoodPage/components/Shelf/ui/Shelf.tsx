import clsx from 'clsx';
import { type Ref } from 'react';
import { Link } from 'react-router-dom';
import { NeighborhoodPlaceCard } from 'entities/NeighborhoodPlaceCard';
import { RoutePaths } from 'shared/constants';
import { type NeighborhoodPlace } from '../../../types';
import cls from './Shelf.module.scss';

interface ShelfProps {
  /** The section's `id`, so a URL hash can land on it. */
  id: string;
  title: string;
  places: readonly NeighborhoodPlace[];
  /** Cards per row on desktop; a phone shows a carousel instead. */
  columns: 3 | 5;
  /** How many Places "See all N on the map" shows. */
  mapCount: number;
  /** Called on "See all N on the map", before the map opens. */
  onMapOpen: () => void;
  onCardOpen: () => void;
  ref?: Ref<HTMLElement>;
}

/** A titled grid of compact Place cards, a carousel on a phone, with "See all N on the map" under it. */
export const Shelf = ({ id, title, places, columns, mapCount, onMapOpen, onCardOpen, ref }: ShelfProps) => (
  <section ref={ref} id={id} tabIndex={-1} className={cls.section} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className={cls.title}>
      {title}
    </h2>
    <ul className={clsx(cls.list, cls[`columns${columns}`])}>
      {places.map((place) => (
        <li
          key={place.id}
          className={cls.item}
          // The browser scrolls only the focused link into view; a carousel shows the whole card.
          onFocus={(event) => {
            event.currentTarget.scrollIntoView({ block: 'nearest', inline: 'nearest' });
          }}
        >
          <NeighborhoodPlaceCard place={place} onOpen={onCardOpen} />
        </li>
      ))}
    </ul>
    <div className={cls.seeAll}>
      <Link to={RoutePaths.main} className={cls.seeAllLink} onClick={onMapOpen}>
        See all {mapCount} on the map
      </Link>
    </div>
  </section>
);
