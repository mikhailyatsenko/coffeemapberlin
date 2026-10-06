export type RatingSummarySize = 'small' | 'medium';

export interface RatingSummaryProps {
  averageRating: number | null | undefined;
  ratingCount: number;
  /** Only scales the row: small for MainPage's compact card, medium for NeighborhoodPage's card. */
  size?: RatingSummarySize;
}
