export type RatingSummarySize = 'small' | 'medium';

export interface RatingSummaryProps {
  averageRating: number | null | undefined;
  ratingCount: number;
  /** Only scales the row: small for compact cards (MainPage, Neighborhood shelves), medium for larger cards. */
  size?: RatingSummarySize;
}
