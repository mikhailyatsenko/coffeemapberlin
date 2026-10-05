export const RATING_OPTIONS = [
  { value: 0, label: 'All' },
  { value: 3, label: '3+' },
  { value: 3.5, label: '3.5+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
  { value: 5, label: '5' },
] as const;

/** Features shown before "Show all", spelled exactly as the server sends them; missing ones just don't show */
export const COMMON_FEATURES = [
  'Free Wi-Fi',
  'Good for working on laptop',
  'Quiet',
  'Outdoor seating',
  'Dogs allowed',
  'Vegan options',
  'Vegetarian options',
  'Breakfast',
  'Brunch',
  'Takeaway',
  'Wheelchair accessible entrance',
  'Cash only',
] as const;
