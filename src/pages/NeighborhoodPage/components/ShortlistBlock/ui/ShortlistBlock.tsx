import { useRef } from 'react';
import { SHORTLISTS } from '../../../constants';
import { type NeighborhoodShortlist } from '../../../types';
import { PlacesSection } from '../../PlacesSection';
import { useOnFirstView } from '../hooks/useOnFirstView';

interface ShortlistBlockProps {
  shortlist: NeighborhoodShortlist;
  onView: () => void;
  onCardOpen: () => void;
}

/** One Shortlist's top Places, under the Shortlist's anchor. */
export const ShortlistBlock = ({ shortlist, onView, onCardOpen }: ShortlistBlockProps) => {
  const ref = useRef<HTMLElement>(null);
  useOnFirstView(ref, onView);
  const { title, anchor } = SHORTLISTS[shortlist.id];

  return <PlacesSection ref={ref} id={anchor} title={title} places={shortlist.places} onCardOpen={onCardOpen} />;
};
