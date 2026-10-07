import { type SwitcherSection } from '../components/SectionSwitcher';
import { ALL_PLACES_ANCHOR, SHORTLISTS, TOP_RATED_ANCHOR } from '../constants';
import { type NeighborhoodShortlist } from '../types';

interface SwitcherSectionsInput {
  hasTopRated: boolean;
  /** The Shortlists shown, in page order. */
  shortlists: ReadonlyArray<Pick<NeighborhoodShortlist, 'id' | 'total'>>;
  placesTotal: number;
}

/** The section switcher's links: the sections on the page, in page order. */
export const switcherSections = ({
  hasTopRated,
  shortlists,
  placesTotal,
}: SwitcherSectionsInput): SwitcherSection[] => [
  ...(hasTopRated ? [{ target: 'top_rated' as const, anchor: TOP_RATED_ANCHOR, label: 'Top rated' }] : []),
  ...shortlists.map(({ id, total }) => ({
    target: id,
    anchor: SHORTLISTS[id].anchor,
    label: SHORTLISTS[id].title,
    count: total,
  })),
  { target: 'all', anchor: ALL_PLACES_ANCHOR, label: 'All', count: placesTotal },
];
