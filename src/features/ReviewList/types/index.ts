import { type Review } from 'shared/generated/graphql';
export interface ReviewListProps {
  showRateNow?: boolean;
  setShowRateNow?: React.Dispatch<React.SetStateAction<boolean>>;
  reviews: Review[];
  placeId: string;
  isCompactView: boolean;
  setCompactView: (isCompact: boolean) => void;
  onEditReview?: (reviewText: string) => void;
}
