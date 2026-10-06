import { useRef } from 'react';
import { SHORTLIST_MIN_RATING, SHORTLISTS } from '../../../constants';
import { showNeighborhoodOnMap } from '../../../model/showNeighborhoodOnMap';
import { type NeighborhoodShortlist } from '../../../types';
import { Shelf } from '../../Shelf';
import { useOnFirstView } from '../hooks/useOnFirstView';

interface ShortlistBlockProps {
  shortlist: NeighborhoodShortlist;
  /** The Neighborhood's name as the map's Filters know it. */
  neighborhood: string;
  onView: () => void;
  onCardOpen: () => void;
  onMapOpen: () => void;
}

/** One Shortlist's top Places, under the Shortlist's anchor, and a link to all of them on the map. */
export const ShortlistBlock = ({ shortlist, neighborhood, onView, onCardOpen, onMapOpen }: ShortlistBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  useOnFirstView(ref, onView);
  const { title, anchor } = SHORTLISTS[shortlist.id];

  return (
    <Shelf
      ref={ref}
      id={anchor}
      title={title}
      places={shortlist.places}
      columns={5}
      mapCount={shortlist.total}
      onMapOpen={() => {
        showNeighborhoodOnMap(neighborhood, { amenities: shortlist.amenities, minRating: SHORTLIST_MIN_RATING });
        onMapOpen();
      }}
      onCardOpen={onCardOpen}
    />
  );
};
