import { ShortlistId } from 'shared/generated/graphql';

/** Top rated holds Places with at least this Average rating. */
export const TOP_RATED_MIN_RATING = 4.5;

/** The Top rated section's `id`, so `/neighborhood/mitte#top-rated` lands on it. */
export const TOP_RATED_ANCHOR = 'top-rated';

/** The full list's `id`. */
export const ALL_PLACES_ANCHOR = 'all-places';

/** The section switcher is left out with fewer sections on the page than this. */
export const SWITCHER_MIN_SECTIONS = 2;

/** A Place makes a Shortlist with at least this Average rating; "See all on the map" filters by it. */
export const SHORTLIST_MIN_RATING = 4;

/** A Shortlist with fewer Places than this is hidden in that Neighborhood. */
export const SHORTLIST_MIN_PLACES = 3;

interface ShortlistDisplay {
  title: string;
  /** The section's `id`, so `/neighborhood/mitte#dog-friendly` lands on it. */
  anchor: string;
}

/** How the page shows each Shortlist; the server owns their order and Amenities. */
export const SHORTLISTS: Record<ShortlistId, ShortlistDisplay> = {
  [ShortlistId.work]: { title: 'Work', anchor: 'work' },
  [ShortlistId.dogFriendly]: { title: 'Dog friendly', anchor: 'dog-friendly' },
  [ShortlistId.outdoorSeating]: { title: 'Outdoor seating', anchor: 'outdoor-seating' },
  [ShortlistId.breakfastBrunch]: { title: 'Breakfast & brunch', anchor: 'breakfast-brunch' },
};
