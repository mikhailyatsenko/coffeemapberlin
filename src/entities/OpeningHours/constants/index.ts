export const DAY_NAMES = {
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  Sunday: 'Sunday',
} as const;

export const DAY_SHORT_NAMES = {
  [DAY_NAMES.Monday]: 'Mon',
  [DAY_NAMES.Tuesday]: 'Tue',
  [DAY_NAMES.Wednesday]: 'Wed',
  [DAY_NAMES.Thursday]: 'Thu',
  [DAY_NAMES.Friday]: 'Fri',
  [DAY_NAMES.Saturday]: 'Sat',
  [DAY_NAMES.Sunday]: 'Sun',
} as const;

export const DAY_ORDER = [
  DAY_NAMES.Monday,
  DAY_NAMES.Tuesday,
  DAY_NAMES.Wednesday,
  DAY_NAMES.Thursday,
  DAY_NAMES.Friday,
  DAY_NAMES.Saturday,
  DAY_NAMES.Sunday,
] as const;
