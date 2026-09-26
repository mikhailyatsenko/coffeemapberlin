import { type ReactNode, type Ref } from 'react';
import { CardContribution } from 'features/RateNow';
import { NeighborhoodPlaceCard } from 'entities/NeighborhoodPlaceCard';
import { type NeighborhoodPlace, type NeighborhoodSection } from '../../../types';
import cls from './PlacesSection.module.scss';

interface PlacesSectionProps {
  /** The section's `id`, so a URL hash can land on it. */
  id: string;
  title: string;
  /** Which section the cards are in, for analytics. */
  section: NeighborhoodSection;
  places: readonly NeighborhoodPlace[];
  onCardOpen: () => void;
  ref?: Ref<HTMLElement>;
  children?: ReactNode;
}

/** A titled list of Place cards; `children` go under the list. */
export const PlacesSection = ({ id, title, section, places, onCardOpen, ref, children }: PlacesSectionProps) => (
  <section ref={ref} id={id} className={cls.section} aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className={cls.title}>
      {title}
    </h2>
    <div className={cls.list}>
      {places.map((place) => (
        <NeighborhoodPlaceCard
          key={place.id}
          place={place}
          onOpen={onCardOpen}
          contribution={
            <CardContribution placeId={place.id} ownRating={place.properties.ownRating} section={section} />
          }
        />
      ))}
    </div>
    {children}
  </section>
);
