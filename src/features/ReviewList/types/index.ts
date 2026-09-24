import { type Review } from 'shared/generated/graphql';
export interface ReviewListProps {
  reviews: Review[];
  placeId: string;
  isCompactView: boolean;
  setCompactView: (isCompact: boolean) => void;
  onEditReview?: (reviewText: string) => void;
  /** Takes the person to the Review form. Without it, the "Be first to write one" prompt isn't shown. */
  onWriteReview?: () => void;
}
