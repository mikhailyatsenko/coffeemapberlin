import { type ReactNode, type Ref } from 'react';
import { NeighborhoodPlaceCard } from 'entities/NeighborhoodPlaceCard';
import { type NeighborhoodPlace } from '../../../types';
import cls from './PlacesSection.module.scss';

interface PlacesSectionProps {
  /** The section's `id`, so a URL hash can land on it. */
  id: string;
  title: string;
  places: readonly NeighborhoodPlace[];
  onCardOpen: () => void;
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
}

/** A titled list of Place cards; `children` go under the list. */
export const PlacesSection = ({ id, title, places, onCardOpen, ref, children }: PlacesSectionProps) => (
  <section ref={ref} id={id} className={cls.section} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className={cls.title}>
      {title}
    </h2>
    <div className={cls.list}>
      {places.map((place) => (
        <NeighborhoodPlaceCard key={place.id} place={place} onOpen={onCardOpen} />
      ))}
    </div>
    {children}
  </section>
);
