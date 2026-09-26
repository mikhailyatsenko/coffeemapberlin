import { Characteristic, ShortlistId } from 'shared/generated/graphql';

/** Top rated holds Places with at least this Average rating. */
export const TOP_RATED_MIN_RATING = 4.5;

/** A Place makes a Shortlist with at least this Average rating; "See all on the map" filters by it. */
export const SHORTLIST_MIN_RATING = 4;

/** A Shortlist with fewer Places than this is hidden in that Neighborhood. */
export const SHORTLIST_MIN_PLACES = 3;

interface ShortlistDisplay {
  title: string;
  /** The section's `id`, so `/neighborhood/mitte#dog-friendly` lands on it. */
  anchor: string;
  /** The Characteristic a Shortlist card asks about once the person has rated the Place. */
  question: Characteristic;
}

/** How the page shows each Shortlist; the server owns their order and Amenities. */
export const SHORTLISTS: Record<ShortlistId, ShortlistDisplay> = {
  [ShortlistId.work]: { title: 'Work', anchor: 'work', question: Characteristic.freeWifi },
  [ShortlistId.dogFriendly]: { title: 'Dog friendly', anchor: 'dog-friendly', question: Characteristic.petFriendly },
  [ShortlistId.outdoorSeating]: {
    title: 'Outdoor seating',
    anchor: 'outdoor-seating',
    question: Characteristic.outdoorSeating,
  },
  [ShortlistId.breakfastBrunch]: {
    title: 'Breakfast & brunch',
    anchor: 'breakfast-brunch',
    question: Characteristic.yummyEats,
  },
};
