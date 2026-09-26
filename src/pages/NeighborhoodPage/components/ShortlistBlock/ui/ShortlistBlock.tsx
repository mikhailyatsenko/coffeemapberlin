import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { RoutePaths } from 'shared/constants';
import { SHORTLISTS } from '../../../constants';
import { type NeighborhoodShortlist } from '../../../types';
import { PlacesSection } from '../../PlacesSection';
import { useOnFirstView } from '../hooks/useOnFirstView';
import { showShortlistOnMap } from '../model/showShortlistOnMap';
import cls from './ShortlistBlock.module.scss';

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
    <PlacesSection
      ref={ref}
      id={anchor}
      title={title}
      section={shortlist.id}
      places={shortlist.places}
      onCardOpen={onCardOpen}
    >
      <div className={cls.seeAll}>
        <Link
          to={RoutePaths.main}
          className={cls.seeAllLink}
          onClick={() => {
            showShortlistOnMap(neighborhood, shortlist);
            onMapOpen();
          }}
        >
          See all {shortlist.total} on the map
        </Link>
      </div>
    </PlacesSection>
  );
};
